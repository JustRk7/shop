import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Button, Card, Form, Modal } from 'react-bootstrap';
import { FaUsers, FaBox, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { db } from '../firebase'; // Імпортуємо db з firebase.js
import { collection, getDocs } from 'firebase/firestore'; // Імпортуємо Firestore функції

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null });
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(true); // Стан для відображення модального вікна
  const [password, setPassword] = useState(''); // Стан для пароля
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false); // Стан для перевірки пароля

  // Завантаження товарів
  useEffect(() => {
    fetchProducts();
  }, []);

  // Завантаження користувачів з Firebase
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Отримати товари
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Помилка отримання товарів:', error);
    }
  };

  // Отримати користувачів
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users')); // Отримуємо колекцію 'users' з Firestore
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList); // Зберігаємо список користувачів у стан
    } catch (error) {
      console.error('Помилка отримання користувачів:', error);
    }
  };

  // Обробка завантаження зображення
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.imageUrl; // Повертаємо URL зображення
    } catch (error) {
      console.error('Помилка завантаження зображення:', error);
      return null;
    }
  };

  // Додавання товару
  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price.trim() || !newProduct.description.trim() || !newProduct.image) {
      alert('Заповніть всі поля та виберіть фото.');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(newProduct.image);
      if (imageUrl) {
        const productData = { ...newProduct, imageUrl };
        await axios.post('http://localhost:5000/api/products', productData);
        setProducts([...products, productData]);
        setNewProduct({ name: '', price: '', description: '', image: null });
      }
    } catch (error) {
      console.error('Помилка додавання товару:', error);
    }
  };

  const handleDeleteProduct = async (name) => {
    console.log("Видаляємо товар з ім'ям:", name); // Перевіряємо, чи правильно передається name
  
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${name}`);
      console.log("Сервер відповів:", response.data); // Додано для перевірки
  
      setProducts(products.filter(product => product.name !== name)); 
    } catch (error) {
      console.error("Помилка видалення товару:", error);
    }
  };

  // Обробка введення пароля
  const handlePasswordSubmit = () => {
    if (password === 'admin') {
      setIsPasswordCorrect(true); // Якщо пароль правильний, доступ дозволено
      setShowModal(false); // Закриваємо модальне вікно
    } else {
      alert('Невірний пароль!'); // Якщо пароль неправильний
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-dark text-white p-4" style={{ height: '100vh' }}>
          <h3 className="text-center mb-4">Адмін Панель</h3>
          <Nav className="flex-column">
            <Nav.Link onClick={() => setActiveTab('users')} className="text-white">
              <FaUsers /> Користувачі
            </Nav.Link>
            <Nav.Link onClick={() => setActiveTab('products')} className="text-white">
              <FaBox /> Товари
            </Nav.Link>
            <Nav.Link href="/" className="text-white">
              <FaSignOutAlt /> Вийти
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={10} className="p-4">
          {activeTab === 'products' && isPasswordCorrect && (
            <div>
              <h4>Управління товарами</h4>
              <Form>
                <Form.Group>
                  <Form.Label>Назва товару</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Ціна</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Опис</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Зображення</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  />
                </Form.Group>
                <Button variant="primary" className="mt-3" onClick={handleAddProduct}>
                  Додати товар
                </Button>
              </Form>

              <h5 className="mt-4">Список товарів</h5>
              <Row>
                {products.map(product => (
                  <Col md={4} key={product.name} className="mb-3">
                    <Card>
                      <Card.Img variant="top" src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <h5>{product.price} грн</h5>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.name)}>
                          Видалити
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {activeTab === 'users' && isPasswordCorrect && (
            <div>
              <h4>Список користувачів</h4>
              <Row>
                {users.map(user => (
                  <Col md={4} key={user.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                        <Card.Text>{user.email}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Модальне вікно для пароля */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Введіть пароль адміністратора</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрити
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Підтвердити
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Admin;
