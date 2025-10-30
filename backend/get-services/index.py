import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get list of available services and executors for Telegram Web App
    Args: event with httpMethod
    Returns: HTTP response with services and executors lists
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
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("SELECT id, name, description, base_price, category FROM services WHERE is_active = true ORDER BY category, name")
    services = cur.fetchall()
    
    cur.execute("SELECT id, name, phone, rating, experience_years FROM executors WHERE is_active = true ORDER BY rating DESC, name")
    executors = cur.fetchall()
    
    cur.close()
    conn.close()
    
    services_list = []
    for svc in services:
        services_list.append({
            'id': svc['id'],
            'name': svc['name'],
            'description': svc['description'],
            'base_price': float(svc['base_price']) if svc['base_price'] else 0,
            'category': svc['category']
        })
    
    executors_list = []
    for executor in executors:
        executors_list.append({
            'id': executor['id'],
            'name': executor['name'],
            'phone': executor['phone'],
            'rating': float(executor['rating']) if executor['rating'] else 5.0,
            'experience_years': executor['experience_years']
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'services': services_list,
            'executors': executors_list
        })
    }