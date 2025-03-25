import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Замінено useHistory на useNavigate
import { auth } from '../firebase'; // Імпортуємо auth з firebase.js
import { signInWithEmailAndPassword } from 'firebase/auth'; // Імпортуємо signInWithEmailAndPassword
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Стан для збереження помилок
  const navigate = useNavigate(); // Використовуємо useNavigate замість useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очистити помилки перед новою спробою
    try {
      // Використовуємо signInWithEmailAndPassword з імпортованим auth
      await signInWithEmailAndPassword(auth, email, password); 
      navigate('/dashboard'); // Перехід на сторінку після успішного входу
    } catch (error) {
      // Обробка помилок
      if (error.code === 'auth/invalid-email') {
        setError('Невірний формат email-адреси');
      } else if (error.code === 'auth/user-not-found') {
        setError('Користувача з таким email не знайдено');
      } else if (error.code === 'auth/wrong-password') {
        setError('Невірний пароль');
      } else {
        setError('Сталася помилка при вході. Спробуйте ще раз');
      }
      console.error(error.message); // Для дебагу
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Вхід</h2>

        {/* Виведення повідомлення про помилку, якщо вона є */}
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Увійти
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
