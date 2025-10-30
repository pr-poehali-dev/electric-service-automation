import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get order status and details for client tracking
    Args: event with httpMethod, queryStringParameters with order_id
    Returns: HTTP response with order details, status, executor info
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    order_id = params.get('order_id')
    
    if not order_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'order_id is required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(
        "SELECT o.id, o.status, o.address, o.scheduled_date, o.scheduled_time, o.total_price, o.client_notes, "
        "o.created_at, e.name as executor_name, e.phone as executor_phone, e.rating as executor_rating, "
        "e.current_location_lat, e.current_location_lng "
        "FROM orders o LEFT JOIN executors e ON o.executor_id = e.id WHERE o.id = %s",
        (order_id,)
    )
    order = cur.fetchone()
    
    if not order:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Order not found'})
        }
    
    cur.execute(
        "SELECT s.name, s.description, os.quantity, os.price "
        "FROM order_services os JOIN services s ON os.service_id = s.id WHERE os.order_id = %s",
        (order_id,)
    )
    services = cur.fetchall()
    
    cur.execute(
        "SELECT status, comment, changed_by, created_at FROM order_status_history "
        "WHERE order_id = %s ORDER BY created_at DESC",
        (order_id,)
    )
    history = cur.fetchall()
    
    cur.close()
    conn.close()
    
    result = {
        'order_id': order['id'],
        'status': order['status'],
        'address': order['address'],
        'scheduled_date': str(order['scheduled_date']) if order['scheduled_date'] else None,
        'scheduled_time': str(order['scheduled_time']) if order['scheduled_time'] else None,
        'total_price': float(order['total_price']) if order['total_price'] else 0,
        'created_at': order['created_at'].isoformat() if order['created_at'] else None,
        'executor': {
            'name': order['executor_name'],
            'phone': order['executor_phone'],
            'rating': float(order['executor_rating']) if order['executor_rating'] else None,
            'location': {
                'lat': float(order['current_location_lat']) if order['current_location_lat'] else None,
                'lng': float(order['current_location_lng']) if order['current_location_lng'] else None
            }
        } if order['executor_name'] else None,
        'services': [
            {
                'name': s['name'],
                'description': s['description'],
                'quantity': s['quantity'],
                'price': float(s['price'])
            } for s in services
        ],
        'history': [
            {
                'status': h['status'],
                'comment': h['comment'],
                'changed_by': h['changed_by'],
                'timestamp': h['created_at'].isoformat()
            } for h in history
        ]
    }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps(result)
    }
