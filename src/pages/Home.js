import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav, Modal, Form, Carousel, FormControl, Toast } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSignInAlt, FaUsers, FaCartPlus, FaFacebook, FaInstagram, FaTelegram, FaComments, FaTrash, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Імпортуємо іконку галочки
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showToast, setShowToast] = useState(false); // Додано для сповіщень
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error fetching products:', error));
    setCart(JSON.parse(localStorage.getItem('cart')) || []);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("Товар додано в кошик", product); // Лог для перевірки
  setShowToast(true); // Показуємо сповіщення про додавання
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const purchaseItems = () => {
    if (cart.length === 0) {
      alert('Ваш кошик порожній!');
      return;
    }

    localStorage.setItem('checkoutItems', JSON.stringify(cart));
    setShowCart(false);
    navigate('/checkout');
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    const newMessage = { text: message, sender: 'user' };
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar expanded={expanded} expand="lg" style={{ backgroundColor: "white", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
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
              <Nav.Link onClick={() => setShowCart(true)} style={{ color: "#333" }}>
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

      <Container className="flex-grow-1">
        <Container className="text-center my-4">
          <h1 className="fw-bold">Натуральні дерев'яні вироби, створені з любов’ю</h1>
          <p className="text-muted">Екологічність, якість та унікальний дизайн для вашого затишку</p>
        </Container>

        <Carousel className="mb-4">
          <Carousel.Item>
            <img className="d-block w-100" src="../images/1.webp" alt="Дерев'яні вироби 1" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="../images/2.webp" alt="Дерев'яні вироби 2" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="../images/3.webp" alt="Дерев'яні вироби 3" />
          </Carousel.Item>
        </Carousel>

        <h2 className="text-center my-4">Бестселери</h2>
        <Row>
          {filteredProducts.map((product) => (
            <Col xs={12} sm={6} md={4} lg={3} xl={2} key={product.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={`http://localhost:5000${product.imageUrl}`} className="p-3" />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <h5>{product.price} грн.</h5>
                  <Button variant="success" onClick={() => addToCart(product)}><FaCartPlus /></Button>
                  <Button variant="info" className="ms-2" onClick={() => handleProductDetail(product)}><FaInfoCircle /></Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <h2 className="text-center my-4">Відгуки наших клієнтів</h2>

<Carousel indicators={true} controls={true} className="mb-4 custom-carousel">
  {[
    {
      avatar: "/images/avatar1.jpg",
      stars: 5,
      email: "ivan.petrenko@example.com",
      review: "Чудові вироби! Натуральні матеріали та приємний запах дерева.",
    },
    {
      avatar: "/images/avatar2.jpg",
      stars: 4,
      email: "olga.melnyk@example.com",
      review: "Гарна якість, швидка доставка. Дуже задоволена покупкою!",
    },
    {
      avatar: "/images/avatar3.jpg",
      stars: 5,
      email: "andriy.bondar@example.com",
      review: "Ручна робота на найвищому рівні. Рекомендую всім!",
    },
    {
      avatar: "/images/avatar4.jpg",
      stars: 4,
      email: "natalia.kozlovska@example.com",
      review: "Гарний вибір, хочеться купити ще. Трохи довга доставка.",
    },
    {
      avatar: "/images/avatar5.jpg",
      stars: 5,
      email: "serhiy.koval@example.com",
      review: "Замовляю вдруге. Все чудово! Дякую за якісний сервіс.",
    },
  ].map((review, index) => (
    <Carousel.Item key={index}>
      <div className="review-card text-center p-4">
        <img
          src={review.avatar}
          alt="Avatar"
          className="rounded-circle mb-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <p className="mb-1 fw-bold">{review.email}</p>
        <div className="mb-2">
          {"⭐".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
        </div>
        <p className="review-text">{review.review}</p>
      </div>
    </Carousel.Item>
  ))}
</Carousel>

<style>
  {`
    .custom-carousel .carousel-control-prev, 
    .custom-carousel .carousel-control-next {
      filter: invert(25%);
    }
    
    .custom-carousel .carousel-indicators button {
      background-color: #333 !important;
    }

    .custom-carousel .carousel-indicators .active {
      background-color: black !important;
    }

    .review-card {
      background: #f8f9fa; /* Світло-сірий фон */
      border-radius: 10px;
      padding: 20px;
      max-width: 500px;
      margin: auto;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .review-text {
      font-size: 1.1rem;
      font-style: italic;
      color: #333;
    }
  `}
</style>
      </Container>

      <footer style={{ backgroundColor: "white", color: "#333", boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)", padding: "1.5rem 0", marginTop: "auto" }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <h5>Підтримка онлайн</h5>
              <Button variant="dark" onClick={() => setShowChat(true)}>
                <FaComments /> Чат підтримки
              </Button>
            </Col>
            <Col md={4}>
              <h5>Контактна інформація</h5>
              <p>Email: <a href="mailto:support@myshop.com" style={{ color: "#333", textDecoration: "none" }}>support@myshop.com</a></p>
              <p>Телефон: <a href="tel:+380991234567" style={{ color: "#333", textDecoration: "none" }}>+38 (099) 123-45-67</a></p>
            </Col>
            <Col md={4}>
              <h5>Наші соцмережі</h5>
              <div className="d-flex justify-content-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "#333" }}><FaFacebook size={30} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "#333" }}><FaInstagram size={30} /></a>
                <a href="https://t.me/shop_channel" target="_blank" rel="noopener noreferrer" className="mx-2" style={{ color: "#333" }}><FaTelegram size={30} /></a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Модальне вікно кошика */}
      <Modal show={showCart} onHide={() => setShowCart(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ваш кошик</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length > 0 ? (
            <>
              {cart.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <span>{item.name} - {item.price} грн.</span>
                  <Button variant="danger" size="sm" onClick={() => removeFromCart(index)}><FaTrash /></Button>
                </div>
              ))}
              <Button variant="primary" className="mt-3 w-100" onClick={purchaseItems}><FaCheck /> Купити</Button>
            </>
          ) : <p>Кошик порожній</p>}
        </Modal.Body>
      </Modal>

      {/* Модальне вікно чату підтримки */}
      <Modal show={showChat} onHide={() => setShowChat(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Чат підтримки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chat-box" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напишіть повідомлення..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={sendMessage}>Надіслати</Button>
        </Modal.Footer>
      </Modal>

      {/* Модальне вікно детального перегляду товару */}
      <Modal show={showProductDetail} onHide={() => setShowProductDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`http://localhost:5000${selectedProduct?.imageUrl}`} alt={selectedProduct?.name} className="img-fluid mb-3" />
          <h5>{selectedProduct?.price} грн.</h5>
          <p>{selectedProduct?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => addToCart(selectedProduct)}>Додати в кошик</Button>
        </Modal.Footer>
      </Modal>
      
   {/* Сповіщення про додавання в кошик */}
<Toast
  show={showToast}
  onClose={() => setShowToast(false)}
  delay={3000}
  autohide
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
  }}
>
  <FaCheckCircle style={{ color: 'green', marginRight: '10px', marginLeft: '15px' }} /> {/* Додаємо відступ зліва для галочки */}
  <Toast.Body>Товар додано до кошика!</Toast.Body>
</Toast>
    </div>
  );
}

export default HomePage;
