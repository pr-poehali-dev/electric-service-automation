import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Webhook receiver for Planfix task updates
    Args: event with httpMethod, body containing task updates from Planfix
    Returns: HTTP response confirming webhook processing
    '''
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Planfix-Signature',
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
    
    event_type = body_data.get('event_type')
    task_id = body_data.get('task_id')
    status = body_data.get('status')
    assignee = body_data.get('assignee')
    
    if event_type == 'task.assigned' and task_id and assignee:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(
            "SELECT id FROM orders WHERE planfix_task_id = %s",
            (str(task_id),)
        )
        order = cur.fetchone()
        
        if order:
            cur.execute(
                "SELECT id FROM executors WHERE name = %s LIMIT 1",
                (assignee,)
            )
            executor = cur.fetchone()
            
            if executor:
                cur.execute(
                    "UPDATE orders SET executor_id = %s, status = %s WHERE id = %s",
                    (executor['id'], 'assigned', order['id'])
                )
                
                cur.execute(
                    "INSERT INTO order_status_history (order_id, status, comment, changed_by) "
                    "VALUES (%s, %s, %s, %s)",
                    (order['id'], 'assigned', f'Назначен исполнитель: {assignee}', 'planfix_webhook')
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
            'message': 'Webhook processed',
            'event_type': event_type
        })
    }
