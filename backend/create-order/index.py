import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

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
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'order_id': order_id,
            'message': 'Order created successfully'
        })
    }