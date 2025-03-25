import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Замінено useHistory на useNavigate
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Підключаємо необхідні функції
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Підключаємо Firestore
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Стан для збереження помилки
  const navigate = useNavigate(); // Використовуємо useNavigate замість useHistory
  const auth = getAuth(); // Отримуємо об'єкт аутентифікації
  const db = getFirestore(); // Отримуємо Firestore

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очистити попередні помилки перед новою спробою
    try {
      // Реєстрація користувача в Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Отримуємо об'єкт користувача

      // Створення нового документа в Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        uid: user.uid,
        // Можна додати додаткові поля, наприклад, ім'я користувача
      });

      console.log("Користувач успішно зареєстрований в Firestore");

      // Перехід на сторінку логіну після успішної реєстрації
      navigate('/login'); 
    } catch (error) {
      // Перевірка на тип помилки і відображення відповідного повідомлення
      if (error.code === 'auth/invalid-email') {
        setError('Невірний формат email-адреси');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Ця email-адреса вже зареєстрована');
      } else if (error.code === 'auth/weak-password') {
        setError('Пароль має бути хоча б 6 символів');
      } else {
        setError('Сталася помилка при реєстрації. Спробуйте ще раз');
      }
      console.error(error.message); // Для дебагу
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Реєстрація</h2>

        {/* Виведення повідомлення про помилку, якщо вона є */}
        {error && <Alert variant="danger">{error}</Alert>}

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
            Зареєструватися
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Register;
