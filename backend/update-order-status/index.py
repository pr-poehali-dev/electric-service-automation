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
    Business: Update order status by executor or admin
    Args: event with httpMethod, body containing order_id, new status, comment
    Returns: HTTP response with success confirmation
    '''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Executor-Id, X-Admin-Id',
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
    
    order_id = body_data.get('order_id')
    new_status = body_data.get('status')
    comment = body_data.get('comment', '')
    changed_by = body_data.get('changed_by', 'system')
    
    if not all([order_id, new_status]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'order_id and status are required'})
        }
    
    valid_statuses = ['new', 'assigned', 'in_progress', 'on_way', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT id FROM orders WHERE id = %s", (order_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Order not found'})
        }
    
    cur.execute(
        "UPDATE orders SET status = %s, updated_at = %s WHERE id = %s",
        (new_status, datetime.now(), order_id)
    )
    
    cur.execute(
        "INSERT INTO order_status_history (order_id, status, comment, changed_by) VALUES (%s, %s, %s, %s)",
        (order_id, new_status, comment, changed_by)
    )
    
    # Получаем ID клиента для уведомления
    cur.execute(
        "SELECT c.telegram_id FROM orders o JOIN clients c ON o.client_id = c.id WHERE o.id = %s",
        (order_id,)
    )
    customer_row = cur.fetchone()
    customer_id = str(customer_row['telegram_id']) if customer_row else None
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Синхронизация с Планфикс (если настроен)
    planfix_token = os.environ.get('PLANFIX_API_TOKEN', '')
    if planfix_token:
        try:
            sync_planfix_status(order_id, new_status, planfix_token)
        except Exception as e:
            print(f"Планфикс синхронизация ошибка: {str(e)}")
    
    # Отправка уведомлений о смене статуса
    if customer_id:
        try:
            send_status_notification(order_id, new_status, customer_id, changed_by)
        except Exception as e:
            print(f"Уведомление ошибка: {str(e)}")
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Status updated successfully',
            'order_id': order_id,
            'new_status': new_status,
            'notification_sent': bool(customer_id)
        })
    }


def sync_planfix_status(order_id: int, new_status: str, api_token: str) -> None:
    """Синхронизация статуса с Планфикс"""
    
    status_mapping = {
        'new': 'NEW',
        'assigned': 'ASSIGNED',
        'in_progress': 'IN_PROGRESS',
        'on_way': 'IN_PROGRESS',
        'completed': 'COMPLETED',
        'cancelled': 'CANCELLED'
    }
    
    planfix_status = status_mapping.get(new_status, 'NEW')
    
    # В реальном проекте здесь будет поиск planfix_task_id по order_id в БД
    # Для примера отправляем запрос на обновление
    request_data = {
        "account": os.environ.get('PLANFIX_ACCOUNT', 'your-account'),
        "sid": api_token,
        "action": "task.update",
        "externalId": f"order_{order_id}",  # Используем external_id для связи
        "status": planfix_status
    }
    
    request = urllib.request.Request(
        "https://api.planfix.ru/json",
        data=json.dumps(request_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(request, timeout=10) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"Планфикс обновлен: {result}")


def send_status_notification(
    order_id: int,
    new_status: str,
    customer_id: str,
    changed_by: str
) -> None:
    """Отправка уведомления об изменении статуса"""
    
    status_messages = {
        'new': 'создана',
        'assigned': 'принята мастером',
        'in_progress': 'в работе',
        'on_way': 'мастер в пути',
        'completed': 'завершена',
        'cancelled': 'отменена'
    }
    
    message = f"Заявка #{order_id} {status_messages.get(new_status, 'обновлена')}"
    
    print(f"Уведомление клиенту {customer_id}: {message}")