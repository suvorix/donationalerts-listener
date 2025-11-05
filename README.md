# DonationAlerts Listener

Служба для отслеживания донатов на сервисе DonationAlerts. При получении доната автоматически отправляет вебхук на указанный скрипт обработчика.

## Функциональность

- Подключение к DonationAlerts через WebSocket
- Мониторинг донатов в реальном времени
- Отправка уведомлений на вебхук при получении донатов
- Логирование всех событий
- Поддержка работы в фоновом режиме через PM2

## Установка и настройка

### 1. Клонирование и настройка

```bash
# Копируем файл переменных окружения
cp .env.example .env

# Редактируем файл .env, устанавливаем необходимые параметры:
# - Данные подключения к DonationAlerts
# - URL вебхука для обработки донатов
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск приложения

```bash
# Запуск в development режиме
npm start

# Или запуск напрямую
node app.js
```

## Развертывание на сервере

### Установка PM2

```bash
npm install -g pm2
```

### Управление приложением через PM2

```bash
# Запуск приложения
pm2 start app.js --name "donationalerts-listener"

# Настройка автозапуска при перезагрузке сервера
pm2 startup
pm2 save

# Просмотр логов
pm2 logs donationalerts-listener

# Мониторинг состояния
pm2 monit

# Перезапуск приложения
pm2 restart donationalerts-listener

# Остановка приложения
pm2 stop donationalerts-listener

# Удаление приложения из PM2
pm2 delete donationalerts-listener
```

## Структура проекта

```
donationalerts-listener/
├── .env                    # Переменные окружения (создается из .env.example)
├── .env.example            # Пример файла конфигурации
├── app.js                  # Основной файл приложения
├── LICENSE.txt             # Файл лицензии
├── package.json            # Зависимости и скрипты
└── README.md               # Документация
```

## Конфигурация

В файле `.env` необходимо установить следующие переменные:

```
DONATION_ALERTS_ACCESS_TOKEN="your_access_token_here"
DONATION_ALERTS_SOCKET_TOKEN="your_socket_token_here"
DONATION_ALERTS_USER_ID="your_user_id_here"
WEBHOOK_URL="https://your-webhook-url.com/handler"
```

## Требования

- Аккаунт DonationAlerts с доступом к API
- PM2 (для продакшн-развертывания)

## Поддержка

При возникновении проблем проверьте:
1. Корректность токена DonationAlerts
2. Доступность вебхук URL
3. Наличие необходимых портов для WebSocket соединения
4. Логи приложения через `pm2 logs donationalerts-listener`