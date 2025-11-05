require('dotenv').config();
const Centrifuge = require('centrifuge');
const WebSocket = require('ws');
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function sendWebhook(data) {
  const url = process.env.WEBHOOK_URL;
  
  if (!url) {
    console.error('URL-адрес Webhook не найден в переменных окружения');
    return;
  }

  const lib = url.startsWith('https://') ? require('https') : require('http');
  
  const req = lib.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Игнорируем все события ответа
  req.on('error', () => {}); // Игнорируем ошибки
  req.on('timeout', () => req.destroy()); // Таймаут - разрушаем соединение

  req.write(JSON.stringify(data));
  req.end(); // Немедленно закрываем запрос

  console.log('Отправлен Webhook');
}

const access_token = process.env.DONATION_ALERTS_ACCESS_TOKEN;
const socket_token = process.env.DONATION_ALERTS_SOCKET_TOKEN;
const aUrl = 'wss://centrifugo.donationalerts.com/connection/websocket';

let centrifuge = new Centrifuge(aUrl, {
  websocket: WebSocket,
  subscribeEndpoint: 'https://www.donationalerts.com/api/v1/centrifuge/subscribe',
  subscribeHeaders: {
    'Authorization': `Bearer ${access_token}`
  }
});

centrifuge.setToken(socket_token);
centrifuge.connect();

centrifuge.on('connect', async function(context) {
  let clientID = context.client;
  console.log('Вы подключились!', clientID);
  centrifuge.subscribe('$alerts:donation_' + process.env.DONATION_ALERTS_USER_ID, message => {
    sendWebhook(message.data);
  });
});

centrifuge.on('disconnect', function(context) {
  console.log('Вы отключились :(', context);
})

