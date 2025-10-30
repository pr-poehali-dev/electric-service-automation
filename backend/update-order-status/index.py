import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

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
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Status updated successfully',
            'order_id': order_id,
            'new_status': new_status
        })
    }
