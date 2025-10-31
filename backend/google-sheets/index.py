'''
Business: Отправка заявок в Google Sheets через webhook
Args: event - dict с httpMethod, body (JSON заявки)
      context - объект с request_id
Returns: HTTP response с результатом отправки
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
    
    webhook_url = os.environ.get('GOOGLE_SHEETS_WEBHOOK_URL', '')
    
    if not webhook_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Google Sheets webhook URL not configured'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    order_data = json.loads(body_str)
    
    payload = {
        'orderId': order_data.get('id', ''),
        'date': order_data.get('date', ''),
        'time': order_data.get('time', ''),
        'phone': order_data.get('phone', ''),
        'address': order_data.get('address', ''),
        'totalSwitches': order_data.get('totalSwitches', 0),
        'totalOutlets': order_data.get('totalOutlets', 0),
        'totalPoints': order_data.get('totalPoints', 0),
        'estimatedCable': order_data.get('estimatedCable', 0),
        'estimatedFrames': order_data.get('estimatedFrames', 0),
        'items': order_data.get('items', [])
    }
    
    req = urllib.request.Request(
        webhook_url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    urllib.request.urlopen(req)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'orderId': payload['orderId']}),
        'isBase64Encoded': False
    }
