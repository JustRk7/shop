import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: null });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    // Завантажуємо товари з JSON
    fetch('http://localhost:5001/api/seller-products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Помилка завантаження товарів:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.image) {
      alert('Оберіть зображення для товару!');
      return;
    }

    try {
      // Завантажуємо зображення
      const imageFormData = new FormData();
      imageFormData.append('image', product.image);

      const uploadRes = await fetch('http://localhost:5001/api/seller-products/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        throw new Error('Помилка завантаження зображення');
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.imageUrl;

      // Додаємо товар у JSON
      const productData = {
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl,
        sellerEmail: userEmail,
      };

      const res = await fetch('http://localhost:5001/api/seller-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert('Товар додано успішно!');
        setProduct({ name: '', price: '', description: '', image: null });
        setProducts([...products, productData]);
      } else {
        alert('Помилка додавання товару.');
      }
    } catch (error) {
      console.error('Помилка:', error);
    }
  };

  // Фільтрація товарів по email
  const filteredProducts = products.filter(product => product.sellerEmail === userEmail);

  return (
    <Container className="mt-4">
      {/* Хедер */}
      <Row>
        <Col>
          <header className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="text-primary">Кабінет продавця</h1>
            <div>
              <span className="fw-bold">Email: {userEmail}</span>
            </div>
          </header>
        </Col>
      </Row>

      <Row>
        {/* Ліва частина - Інформація та форма */}
        <Col md={4}>
          <Card className="border-light shadow-sm">
            <Card.Body>
              <h4>Додати товар</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Назва товару</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Введіть назву товару"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Ціна</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    placeholder="Введіть ціну товару"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Опис</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Введіть опис товару"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Фото товару</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3 w-100">
                  Додати товар
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Права частина - Список товарів */}
        <Col md={8}>
          <h4>Мої товари</h4>
          <div className="d-flex flex-wrap">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p, index) => (
                <Card key={index} className="m-2 shadow-sm" style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`http://localhost:5001${p.imageUrl}`} />
                  <Card.Body>
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text>{p.description}</Card.Text>
                    <h5>{p.price} грн</h5>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p>У вас немає доданих товарів.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
