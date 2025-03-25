import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
  }, []);

  const removeFromWishlist = (index) => {
    const updatedWishlist = wishlist.filter((_, i) => i !== index);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <Container>
      <h2 className="text-center my-4">Список вподобань</h2>
      {wishlist.length > 0 ? (
        <Row>
          {wishlist.map((product, index) => (
            <Col sm={12} md={4} lg={3} key={index} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`http://localhost:5000${product.imageUrl}`} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <h5>{product.price} грн.</h5>
                  <Button variant="danger" onClick={() => removeFromWishlist(index)}>
                    <FaTrash /> Видалити
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">Список вподобань порожній</p>
      )}
    </Container>
  );
}

export default WishlistPage;
