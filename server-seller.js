const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 5001; // Інший порт для другого сервера

// Дозволяємо CORS для всіх запитів з http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Налаштування збереження файлів у папку uploads-seller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads-seller/'); // Інша папка для завантажень
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads-seller', express.static(path.join(__dirname, 'uploads-seller')));

const productsFile = path.join(__dirname, 'products-seller.json');

// Функції для читання та запису у products-seller.json
const readProducts = () => {
  try {
    if (!fs.existsSync(productsFile)) return [];
    const data = fs.readFileSync(productsFile, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading products-seller.json:', err);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing to products-seller.json:', err);
  }
};

// 🔹 Головна сторінка
app.get('/', (req, res) => {
  res.send('<h1>Сервер для продавців працює! 🚀</h1><p>API: <a href="/api/seller-products">/api/seller-products</a></p>');
});

// 🔹 Отримати список товарів продавців
app.get('/api/seller-products', (req, res) => {
  res.json(readProducts());
});

// 🔹 Додати товар продавця з зображенням
app.post('/api/seller-products/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не був завантажений' });

  const imageUrl = `/uploads-seller/${req.file.filename}`;
  res.json({ imageUrl });
});

app.post('/api/seller-products', (req, res) => {
  const { name, price, description, imageUrl, sellerEmail } = req.body;
  if (!name || !price || !sellerEmail) return res.status(400).json({ error: 'Не всі обов’язкові поля заповнені' });

  const products = readProducts();
  const newProduct = { id: Date.now(), name, price, description, imageUrl, sellerEmail };
  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

// 🔹 Видалити товар продавця за name
app.delete('/api/seller-products/:name', (req, res) => {
  const productName = req.params.name;
  let products = readProducts();

  const productIndex = products.findIndex(product => product.name === productName);
  if (productIndex === -1) return res.status(404).json({ error: 'Товар не знайдено' });

  products.splice(productIndex, 1);
  writeProducts(products);
  
  res.status(200).json({ message: 'Товар успішно видалено' });
});

// 🔹 Обробка неправильних маршрутів
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// 🔹 Запуск сервера
app.listen(port, () => {
  console.log(`✅ Сервер для продавців працює: http://localhost:${port}`);
});
