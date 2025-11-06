'''
Business: Интеграция с Планфикс для синхронизации заявок
Args: event - dict с httpMethod, body (JSON с данными заявки)
      context - object с request_id
Returns: HTTP response с результатом создания/обновления задачи в Планфикс
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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    api_key = os.environ.get('PLANFIX_API_KEY')
    account = os.environ.get('PLANFIX_ACCOUNT')
    
    if not api_key or not account:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Планфикс не настроен. Добавьте API ключ и аккаунт.'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    order_data = OrderData(**body_data)
    
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
    planfix_url = f'https://{account_clean}.planfix.ru/rest/task'
    
    payload = {
        'title': f'Заявка #{order_data.order_id} - {order_data.customer_name}',
        'description': task_description,
        'project': 1
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json; charset=utf-8'
    }
    
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
            })
        }
    
    return {
        'statusCode': response.status_code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'error': 'Ошибка создания задачи в Планфикс',
            'details': response.text
        })
    }