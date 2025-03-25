// Новий сервер на порту 5002
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5002;

app.use(bodyParser.json());

const messagesFilePath = path.join(__dirname, 'messages.json');

const readMessagesFromFile = () => {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeMessagesToFile = (messages) => {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Помилка запису у файл:', error);
  }
};

app.post('/api/send-message', (req, res) => {
  const { sellerEmail, message, buyerEmail } = req.body;

  if (!sellerEmail || !message || !buyerEmail) {
    return res.status(400).json({ status: 'error', message: 'Не всі дані надані' });
  }

  const messages = readMessagesFromFile();
  const newMessage = {
    sellerEmail,
    buyerEmail,
    message,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  writeMessagesToFile(messages);

  res.json({ status: 'success', message: 'Повідомлення надіслано!' });
});

app.get('/api/messages', (req, res) => {
  const { sellerEmail } = req.query;
  if (!sellerEmail) {
    return res.status(400).json({ status: 'error', message: 'Не вказано email продавця' });
  }

  const messages = readMessagesFromFile();
  const sellerMessages = messages.filter((message) => message.sellerEmail === sellerEmail);
  res.json(sellerMessages);
});

app.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});
