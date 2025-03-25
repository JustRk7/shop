const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 5000;

// Дозволяємо CORS для всіх запитів з http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// Налаштування збереження файлів у папку uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const productsFile = path.join(__dirname, 'products.json');

const readProducts = () => {
  try {
    if (!fs.existsSync(productsFile)) return [];
    const data = fs.readFileSync(productsFile, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading products.json:', err);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing to products.json:', err);
  }
};

// 🔹 Головна сторінка
app.get('/', (req, res) => {
  res.send('<h1>Сервер працює! 🚀</h1><p>API: <a href="/api/products">/api/products</a></p>');
});

// 🔹 Отримати список товарів
app.get('/api/products', (req, res) => {
  res.json(readProducts());
});

// 🔹 Додати товар з зображенням
app.post('/api/products/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не був завантажений' });

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.post('/api/products', (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Не всі обов’язкові поля заповнені' });

  const products = readProducts();
  const newProduct = { id: Date.now(), name, price, description, imageUrl };
  products.push(newProduct);
  writeProducts(products);

  res.status(201).json(newProduct);
});

app.delete('/api/products/:name', (req, res) => {
  const productName = req.params.name; // Отримуємо name товару з URL
  let products = readProducts(); // Зчитуємо список товарів

  const productIndex = products.findIndex(product => product.name === productName); // Шукаємо товар за name
  if (productIndex === -1) return res.status(404).json({ error: 'Товар не знайдено' });

  products.splice(productIndex, 1); // Видаляємо товар з масиву
  writeProducts(products); // Записуємо оновлений список у products.json
  
  res.status(200).json({ message: 'Товар успішно видалено' });
});

// 🔹 Обробка неправильних маршрутів
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не знайдено' });
});

// 🔹 Запуск сервера
app.listen(port, () => {
  console.log(`✅ Сервер працює: http://localhost:${port}`);
});
