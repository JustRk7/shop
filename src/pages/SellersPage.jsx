import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Navbar, Nav, FormControl } from 'react-bootstrap';
import { FaEnvelope, FaShoppingCart, FaSignInAlt, FaUser, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function SellersPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
 const [cart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/seller-products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Помилка отримання товарів продавців:', error));
  }, []);

  const handleContactSeller = (sellerEmail) => {
    setSelectedSeller(sellerEmail);
    setShowModal(true);
  };

  const handleSendMessage = () => {
    alert(`Повідомлення надіслано продавцю: ${selectedSeller}\nТекст: ${message}`);
    setShowModal(false);
    setMessage('');
  };

  // Фільтрація товарів за пошуковим запитом
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="mx-0 px-0">
  <div className="d-flex flex-column min-vh-100">
    {/* Меню Navbar */}
    <Navbar expanded={expanded} expand="lg" className="w-100" style={{ backgroundColor: "white", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <Container>
        <Navbar.Brand href="/" style={{ color: "#333", fontWeight: "bold" }}>HandMadeStyle</Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse className="justify-content-end">
          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Пошук товарів..."
              className="me-2 form-control-sm w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderColor: "#ccc" }}
            />
          </Form>

          <Nav>
            <Nav.Link style={{ color: "#333" }}>
              <FaShoppingCart /> Кошик ({cart.length})
            </Nav.Link>
            <Nav.Link as={Link} to="/login" style={{ color: "#333" }}>
              <FaSignInAlt /> Вхід
            </Nav.Link>
            <Nav.Link as={Link} to="/register" style={{ color: "#333" }}>
              <FaUser /> Реєстрація
            </Nav.Link>
            <Nav.Link as={Link} to="/sellers" style={{ color: "#333" }}>
              <FaUsers /> Інші продавці
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div className="content-wrapper px-3">
  <h2 className="text-center my-4">Товари від інших продавців</h2>
  <Row>
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <Col xs={12} sm={6} md={4} lg={3} key={product.id} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={`http://localhost:5001${product.imageUrl}`} className="p-3" />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <h5>{product.price} грн.</h5>
              <p className="text-muted">Продавець: <strong>{product.sellerEmail}</strong></p>
              <Button variant="primary" onClick={() => handleContactSeller(product.sellerEmail)}>
                <FaEnvelope /> Зв'язатися з продавцем
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <p className="text-center">Немає товарів</p>
    )}
  </Row>
</div>
        
        {/* Модальне вікно для зв'язку */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Зв'язок із продавцем</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="messageText">
                <Form.Label>Ваше повідомлення для {selectedSeller}:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напишіть ваше повідомлення тут..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Закрити
            </Button>
            <Button variant="success" onClick={handleSendMessage}>
              Надіслати
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
}

export default SellersPage;
