import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <Container>
      <h2 className="text-center my-4">Кошик</h2>
      {cart.length > 0 ? (
        <Row>
          {cart.map((product, index) => (
            <Col sm={12} md={4} lg={3} key={index} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`http://localhost:5000${product.imageUrl}`} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <h5>{product.price} грн.</h5>
                  <Button variant="danger" onClick={() => removeFromCart(index)}>
                    <FaTrash /> Видалити
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">Кошик порожній</p>
      )}
    </Container>
  );
}

export default CartPage;
