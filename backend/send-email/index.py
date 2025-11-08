'''
Business: Отправка email уведомлений через Yandex SMTP
Args: event с body содержащим to, subject, html
Returns: Статус отправки письма
'''

import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    # Handle CORS
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Parse request
    body_data = json.loads(event.get('body', '{}'))
    to_email: str = body_data.get('to', '')
    subject: str = body_data.get('subject', 'Уведомление')
    html_content: str = body_data.get('html', '')
    
    print(f"Получен запрос на отправку email: to={to_email}, subject={subject}")
    
    if not to_email or not html_content:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Missing required fields: to, html'})
        }
    
    # Get credentials from env
    smtp_user = os.environ.get('YANDEX_SMTP_USER', '')
    smtp_password = os.environ.get('YANDEX_SMTP_PASSWORD', '')
    
    print(f"SMTP user: {smtp_user}, Password configured: {bool(smtp_password)}")
    
    if not smtp_user or not smtp_password:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'SMTP credentials not configured'})
        }
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email
    
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    # Send email
    try:
        print(f"Подключение к SMTP серверу...")
        with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
            print(f"Авторизация...")
            server.login(smtp_user, smtp_password)
            print(f"Отправка письма на {to_email}...")
            server.send_message(msg)
        
        print(f"Письмо успешно отправлено на {to_email}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Email sent'})
        }
    except Exception as e:
        print(f"Ошибка отправки email: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to send email: {str(e)}'})
        }