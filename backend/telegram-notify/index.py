'''
Business: Отправка уведомлений клиентам в Telegram через бота
Args: event - dict с httpMethod, body (данные заявки + chat_id клиента)
      context - объект с request_id
Returns: HTTP response с результатом отправки уведомления
'''

import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any

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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Telegram bot token not configured'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    data = json.loads(body_str)
    
    chat_id = data.get('chatId', '')
    order = data.get('order', {})
    
    if not chat_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'chatId is required'}),
            'isBase64Encoded': False
        }
    
    message = f"""
🔔 <b>Новая заявка создана!</b>

📋 <b>Номер заявки:</b> {order.get('id', 'N/A')}

📅 <b>Дата:</b> {order.get('date', 'N/A')}
⏰ <b>Время:</b> {order.get('time', 'N/A')}
📍 <b>Адрес:</b> {order.get('address', 'N/A')}
📱 <b>Телефон:</b> {order.get('phone', 'N/A')}

📊 <b>Расчёты:</b>
💡 Выключателей: {order.get('totalSwitches', 0)}
🔌 Розеток: {order.get('totalOutlets', 0)}
📍 Всего точек: {order.get('totalPoints', 0)}
📏 Метраж кабеля: ~{order.get('estimatedCable', 0)} м
🖼 Рамок: {order.get('estimatedFrames', 0)} шт

✅ Мастер скоро свяжется с вами для уточнения деталей!
"""
    
    telegram_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    payload = {
        'chat_id': chat_id,
        'text': message.strip(),
        'parse_mode': 'HTML'
    }
    
    req = urllib.request.Request(
        telegram_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'messageId': result.get('result', {}).get('message_id')}),
        'isBase64Encoded': False
    }
