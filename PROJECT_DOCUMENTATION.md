# УСЛУГИ ЭЛЕКТРИКА ORG - Документация проекта

## Описание проекта

Единая система управления заявками для электромонтажной компании с интеграцией Telegram Web App, автоматизацией через Planfix/Google Tasks и веб-порталом для администраторов.

## Архитектура системы

### 1. База данных (PostgreSQL)

**Таблицы:**
- `clients` - клиенты (telegram_id, phone, name)
- `executors` - исполнители/мастера (name, phone, rating, experience_years, location)
- `services` - услуги (name, description, base_price, category)
- `orders` - заказы (client_id, executor_id, status, address, scheduled_date, total_price, planfix_task_id, google_task_id)
- `order_services` - связь заказов и услуг (many-to-many)
- `order_status_history` - история изменения статусов
- `reviews` - отзывы клиентов
- `admin_users` - администраторы системы

**Статусы заказов:**
- `new` - новая заявка
- `assigned` - назначена мастеру
- `in_progress` - в работе
- `on_way` - мастер выехал
- `completed` - завершена
- `cancelled` - отменена

### 2. Backend API (Cloud Functions)

#### GET /get-services
Получение списка доступных услуг для Telegram Web App

**Ответ:**
```json
{
  "services": [
    {
      "id": 1,
      "name": "Установка розетки",
      "description": "Установка одной розетки",
      "base_price": 500,
      "category": "installation"
    }
  ]
}
```

**URL:** https://functions.poehali.dev/46dcbdcd-c306-4a31-b776-f6e34eba609f

#### POST /create-order
Создание новой заявки от клиента

**Запрос:**
```json
{
  "telegram_id": 123456789,
  "client_name": "Иван Петров",
  "phone": "+79001234567",
  "address": "ул. Ленина, 10, кв. 5",
  "services": [
    {"service_id": 1, "quantity": 2, "price": 500}
  ],
  "scheduled_date": "2025-11-15",
  "scheduled_time": "14:00",
  "notes": "Позвонить за час"
}
```

**Ответ:**
```json
{
  "success": true,
  "order_id": 1,
  "message": "Order created successfully"
}
```

**URL:** https://functions.poehali.dev/5c3c68df-2e41-4012-81fd-e134547810fb

#### GET /get-order-status
Получение статуса и деталей заказа

**Параметры:** `?order_id=1`

**Ответ:**
```json
{
  "order_id": 1,
  "status": "in_progress",
  "address": "ул. Ленина, 10, кв. 5",
  "total_price": 1800,
  "executor": {
    "name": "Алексей Иванов",
    "phone": "+79991234567",
    "rating": 4.9,
    "location": {"lat": 54.7104, "lng": 20.4522}
  },
  "services": [...],
  "history": [...]
}
```

**URL:** https://functions.poehali.dev/b875ba9a-3e1c-4e76-807f-0525f61dd331

#### POST /update-order-status
Обновление статуса заказа (для исполнителей и админов)

**Запрос:**
```json
{
  "order_id": 1,
  "status": "in_progress",
  "comment": "Мастер выехал",
  "changed_by": "executor_1"
}
```

**URL:** https://functions.poehali.dev/9fde3ede-6010-4014-95a9-ec4e7388f476

### 3. Frontend

#### Клиентский интерфейс (/)
- Каталог услуг
- Форма оформления заказа
- Корзина с выбранными услугами
- Отслеживание статуса заказа

#### Админ-панель (/admin)
- Список всех заказов
- Фильтрация по статусам
- Обновление статусов заказов
- Информация об исполнителях
- Детали каждого заказа

## Интеграции

### Планируемые интеграции:

#### 1. Telegram Web App
- Встроенный интерфейс заказа услуг
- Уведомления о статусе заказа
- Отображение маршрута мастера

#### 2. Planfix API
**Endpoint:** https://api.planfix.ru/xml/
- Создание задач при новых заказах
- Синхронизация статусов
- Назначение исполнителей

#### 3. Google Tasks API
**Endpoint:** https://tasks.googleapis.com/tasks/v1/
- Виджет задач для исполнителей
- Обновление статусов задач
- Комментарии и фотоотчеты

#### 4. WhatsApp Business API
**Endpoint:** https://api.whatsapp.com/send
- Уведомления клиентам
- Подтверждение заказов
- Чат с исполнителем

## Потоки данных

### Сценарий 1: Новый заказ

1. Клиент создает заказ через Telegram Web App
2. POST /create-order → создание записи в БД
3. Webhook → создание задачи в Planfix/Google Tasks
4. Автоматическое назначение исполнителя (по загрузке и геолокации)
5. Уведомление исполнителю (Telegram/WhatsApp)
6. Уведомление клиенту о назначении мастера

### Сценарий 2: Обновление статуса

1. Исполнитель меняет статус в Google Tasks
2. Webhook → POST /update-order-status
3. Обновление БД + запись в историю
4. Уведомление клиенту о новом статусе

### Сценарий 3: Завершение заказа

1. Исполнитель завершает задачу
2. POST /update-order-status (status: completed)
3. Уведомление клиенту с просьбой оставить отзыв
4. Создание записи в таблице reviews
5. Обновление рейтинга исполнителя

## Безопасность

### Аутентификация и авторизация
- Telegram Web App: проверка подписи от Telegram
- Admin панель: OAuth/OpenID (планируется)
- API endpoints: X-Auth-Token header для защищенных операций

### Защита данных
- Шифрование чувствительных данных в БД
- HTTPS для всех API запросов
- CORS настроен для безопасных доменов

### Аудит
- Логирование всех действий в order_status_history
- Хранение информации о том, кто изменил статус
- Timestamp для каждого изменения

## Развертывание на Timeweb

### Артефакты для экспорта:
1. Backend код (Python 3.11)
2. Migrations (db_migrations/)
3. Frontend build (dist/)
4. .env файл с переменными окружения

### Переменные окружения:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
TELEGRAM_BOT_TOKEN=your_token
PLANFIX_API_KEY=your_key
GOOGLE_API_KEY=your_key
WHATSAPP_API_KEY=your_key
```

### Docker развертывание:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

## Мониторинг и KPI

### Метрики для отслеживания:
- Среднее время обработки заказа
- Количество заказов по статусам
- Рейтинг исполнителей
- Количество отзывов
- Конверсия заказов

### Алерты:
- Заказы в статусе "new" более 30 минут
- Низкий рейтинг исполнителя (<4.0)
- Ошибки интеграций

## Дорожная карта

### MVP (Готово)
✅ База данных
✅ Backend API для заказов
✅ Клиентский интерфейс
✅ Админ-панель

### Этап 2 (В разработке)
⏳ Интеграция Telegram Web App
⏳ Интеграция Planfix API
⏳ Интеграция Google Tasks
⏳ WhatsApp уведомления

### Этап 3 (Планируется)
📋 Автоматическое распределение мастеров
📋 Геолокация и маршруты
📋 Отчеты и аналитика
📋 Мобильное приложение для мастеров
📋 Система лояльности для клиентов

## Поддержка и контакты

Telegram: @konigelectric
Телефон: +7 (4012) 52-07-25
