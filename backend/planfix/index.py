'''
Business: Интеграция с Планфикс для синхронизации заявок
Args: event - dict с httpMethod, body (JSON с данными заявки)
      context - object с request_id
Returns: HTTP response с результатом создания/обновления задачи в Планфикс

Требования к настройке:
1. Создайте API ключ в Планфиксе: Настройки → API → Создать ключ
2. Убедитесь что у ключа есть права: "Создание задач" (task.create)
3. Добавьте секреты в проекте:
   - PLANFIX_API_KEY: ваш API ключ из Планфикса
   - PLANFIX_ACCOUNT: название аккаунта (например, "konigkomfort" для konigkomfort.planfix.ru)
'''

import json
import os
import requests
from typing import Dict, Any
from pydantic import BaseModel, Field

class OrderData(BaseModel):
    order_id: str = Field(..., min_length=1)
    customer_name: str
    customer_phone: str
    address: str
    date: str
    time: str
    total_amount: float
    items: list
    status: str

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('PLANFIX_API_KEY')
    account = os.environ.get('PLANFIX_ACCOUNT')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'PLANFIX_API_KEY не установлен. Добавьте секрет в настройках проекта.'}),
            'isBase64Encoded': False
        }
    
    if not account:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'PLANFIX_ACCOUNT не установлен. Добавьте секрет в настройках проекта.'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        order_data = OrderData(**body_data)
    except json.JSONDecodeError as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Невалидный JSON: {str(e)}'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка валидации данных: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    items_text = '\n'.join([
        f"• {item.get('name', 'Услуга')} x{item.get('quantity', 1)} - {item.get('price', 0)}₽"
        for item in order_data.items
    ])
    
    task_description = f'''
Заявка #{order_data.order_id}

Клиент: {order_data.customer_name}
Телефон: {order_data.customer_phone}
Адрес: {order_data.address}
Дата визита: {order_data.date} в {order_data.time}

Услуги:
{items_text}

Сумма: {order_data.total_amount}₽
Статус: {order_data.status}
'''
    
    account_clean = account.replace('.planfix.ru', '')
    planfix_url = f'https://{account_clean}.planfix.ru/rest/task/create'
    
    payload = {
        'name': f'Заявка #{order_data.order_id} - {order_data.customer_name}',
        'description': task_description,
        'template': 1
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json; charset=utf-8'
    }
    
    try:
        response = requests.post(planfix_url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200 or response.status_code == 201:
            planfix_data = response.json()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'task_id': planfix_data.get('id'),
                    'task_url': f'https://{account_clean}.planfix.ru/task/{planfix_data.get("id")}'
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': response.status_code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Ошибка создания задачи в Планфикс',
                'status_code': response.status_code,
                'details': response.text,
                'url': planfix_url
            }),
            'isBase64Encoded': False
        }
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Таймаут при обращении к Планфикс'}),
            'isBase64Encoded': False
        }
    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка запроса к Планфикс: {str(e)}'}),
            'isBase64Encoded': False
        }