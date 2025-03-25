import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут додаємо товар на сервер або у вашу базу даних
    console.log('Продукт додано:', { productName, productPrice });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Додати продукт</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="productName">
            <Form.Label>Назва продукту</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введіть назву продукту"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="productPrice">
            <Form.Label>Ціна продукту</Form.Label>
            <Form.Control
              type="number"
              placeholder="Введіть ціну продукту"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Додати продукт
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AddProduct;
