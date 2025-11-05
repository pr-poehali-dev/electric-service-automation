import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create new order from Telegram Web App
    Args: event with httpMethod, body containing order details
    Returns: HTTP response with order_id
    '''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    telegram_id = body_data.get('telegram_id')
    client_name = body_data.get('client_name')
    phone = body_data.get('phone')
    address = body_data.get('address')
    services = body_data.get('services', [])
    scheduled_date = body_data.get('scheduled_date')
    scheduled_time = body_data.get('scheduled_time')
    client_notes = body_data.get('notes', '')
    executor_id = body_data.get('executor_id')
    
    if not all([telegram_id, phone, address, services]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "INSERT INTO clients (telegram_id, phone, name) VALUES (%s, %s, %s) "
        "ON CONFLICT (telegram_id) DO UPDATE SET phone = EXCLUDED.phone, name = EXCLUDED.name "
        "RETURNING id",
        (telegram_id, phone, client_name)
    )
    client_id = cur.fetchone()['id']
    
    total_price = 0
    for svc in services:
        total_price += svc.get('price', 0) * svc.get('quantity', 1)
    
    initial_status = 'assigned' if executor_id else 'new'
    
    cur.execute(
        "INSERT INTO orders (client_id, executor_id, status, address, scheduled_date, scheduled_time, total_price, client_notes) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (client_id, executor_id, initial_status, address, scheduled_date, scheduled_time, total_price, client_notes)
    )
    order_id = cur.fetchone()['id']
    
    for svc in services:
        cur.execute(
            "INSERT INTO order_services (order_id, service_id, quantity, price) VALUES (%s, %s, %s, %s)",
            (order_id, svc['service_id'], svc.get('quantity', 1), svc.get('price', 0))
        )
    
    cur.execute(
        "INSERT INTO order_status_history (order_id, status, changed_by) VALUES (%s, %s, %s)",
        (order_id, initial_status, f'client_{telegram_id}')
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Интеграция с Планфикс (если настроен)
    planfix_task_id = None
    planfix_token = os.environ.get('PLANFIX_API_TOKEN', '')
    
    if planfix_token:
        try:
            planfix_task_id = create_planfix_task(
                order_id=order_id,
                customer_name=client_name or 'Клиент',
                customer_phone=phone,
                address=address,
                services=services,
                total_price=total_price,
                notes=client_notes,
                api_token=planfix_token
            )
        except Exception as e:
            print(f"Планфикс ошибка (не критично): {str(e)}")
    
    # Отправка уведомлений (не критично, не блокирует создание заказа)
    try:
        send_notifications(
            order_id=order_id,
            customer_id=str(telegram_id),
            executor_id=executor_id,
            status='new_order'
        )
    except Exception as e:
        print(f"Уведомление ошибка (не критично): {str(e)}")
    
    response_data = {
        'success': True,
        'order_id': order_id,
        'message': 'Order created successfully'
    }
    
    if planfix_task_id:
        response_data['planfix_task_id'] = planfix_task_id
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(response_data)
    }


def create_planfix_task(
    order_id: int,
    customer_name: str,
    customer_phone: str,
    address: str,
    services: list,
    total_price: float,
    notes: str,
    api_token: str
) -> Optional[int]:
    """Создание задачи в Планфикс"""
    
    services_text = '\n'.join([
        f"- {svc.get('name', 'Услуга')}: {svc.get('quantity', 1)} шт × {svc.get('price', 0)} ₽"
        for svc in services
    ])
    
    description = f"""
Заявка #{order_id}

Клиент: {customer_name}
Телефон: {customer_phone}
Адрес: {address}

Услуги:
{services_text}

Итого: {total_price} ₽

Комментарий: {notes if notes else 'Нет'}
    """.strip()
    
    request_data = {
        "account": os.environ.get('PLANFIX_ACCOUNT', 'your-account'),
        "sid": api_token,
        "action": "task.add",
        "name": f"Электромонтаж - Заявка #{order_id}",
        "description": description,
        "project": os.environ.get('PLANFIX_PROJECT_ID', '1'),
        "template": os.environ.get('PLANFIX_TEMPLATE_ID', '1')
    }
    
    request = urllib.request.Request(
        "https://api.planfix.ru/json",
        data=json.dumps(request_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(request, timeout=10) as response:
        result = json.loads(response.read().decode('utf-8'))
        
    if result.get('task'):
        return result['task'].get('id')
    
    return None


def send_notifications(
    order_id: int,
    customer_id: str,
    executor_id: Optional[int],
    status: str
) -> None:
    """Отправка уведомлений клиенту и исполнителю"""
    
    # В будущем здесь будет отправка через email/Telegram/push
    # Пока просто логируем
    print(f"Уведомление: Заказ {order_id} создан для клиента {customer_id}")
    
    if executor_id:
        print(f"Уведомление исполнителю {executor_id}: новая заявка {order_id}")