import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSignInAlt, FaUsers, FaCartPlus, FaFacebook, FaInstagram, FaTelegram, FaComments, FaTrash, FaCheck } from 'react-icons/fa';

function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '', phone: '' });
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    setCheckoutItems(savedItems);

    const savedCards = JSON.parse(localStorage.getItem('paymentCards')) || [];
    setCards(savedCards);
  }, []);

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.phone) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }

    if (!selectedCard) {
      alert('Будь ласка, виберіть картку для оплати або додайте нову.');
      return;
    }

    alert('Дякуємо за покупку! Ваше замовлення оформлено.');
    localStorage.removeItem('checkoutItems'); // Очищаємо дані після оформлення
    navigate('/'); // Повертаємо користувача на головну сторінку
  };

  // Обчислення загальної суми
  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  const handleAddCard = (cardDetails) => {
    const updatedCards = [...cards, cardDetails];
    setCards(updatedCards);
    localStorage.setItem('paymentCards', JSON.stringify(updatedCards));
    setShowAddCardModal(false);
  };

  // Відображення частково прихованого номера картки
  const getMaskedCardNumber = (cardNumber) => {
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
  };

  // Перевірка на 14 цифр для номера картки
  const validateCardNumber = (number) => {
    return /^\d{14}$/.test(number); // Перевіряє, чи містить номер рівно 14 цифр
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Оформлення замовлення</h2>
      
      <Row>
        <Col md={6}>
          <h4>Ваші товари</h4>
          {checkoutItems.length > 0 ? (
            checkoutItems.map((item, index) => (
              <Card key={index} className="mb-3">
                <Card.Body className="d-flex justify-content-between">
                  <div>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.price} грн.</Card.Text>
                  </div>
                  <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} width="50" />
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>Кошик порожній</p>
          )}
          {checkoutItems.length > 0 && (
            <h5 className="mt-3">Загальна сума: {calculateTotal()} грн.</h5>
          )}
        </Col>

        <Col md={6}>
          <h4>Контактні дані</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ім'я</Form.Label>
              <Form.Control type="text" name="name" value={customerInfo.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={customerInfo.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Номер телефону</Form.Label>
              <Form.Control type="text" name="phone" value={customerInfo.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Адреса доставки</Form.Label>
              <Form.Control type="text" name="address" value={customerInfo.address} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Вибір картки для оплати</Form.Label>
              <Form.Control as="select" value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)}>
                <option value="">Виберіть картку</option>
                {cards.map((card, index) => (
                  <option key={index} value={card.number}>{getMaskedCardNumber(card.number)}</option>
                ))}
              </Form.Control>
              <Button variant="link" className="mt-2" onClick={() => setShowAddCardModal(true)}>
                Додати нову картку
              </Button>
            </Form.Group>

            <Button variant="primary" className="w-100" onClick={handlePayment}>
              Оформити замовлення
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Модальне вікно для додавання картки */}
      <Modal show={showAddCardModal} onHide={() => setShowAddCardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Додати нову картку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Номер картки (14 цифр)</Form.Label>
              <Form.Control
                type="text"
                id="cardNumber"
                maxLength="14"
                onChange={(e) => {
                  const cardNumber = e.target.value;
                  if (validateCardNumber(cardNumber)) {
                    document.getElementById("cardNumber").setCustomValidity("");
                  } else {
                    document.getElementById("cardNumber").setCustomValidity("Номер картки повинен містити 14 цифр");
                  }
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Дата закінчення терміну (MM/YY)</Form.Label>
              <Form.Control type="text" id="expiryDate" maxLength="4" placeholder="MM/YY" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control type="password" id="cvv" maxLength="3" />
            </Form.Group>
            <Button variant="primary" onClick={() => {
              const cardNumber = document.getElementById('cardNumber').value;
              const expiryDate = document.getElementById('expiryDate').value;
              const cvv = document.getElementById('cvv').value;
              if (validateCardNumber(cardNumber)) {
                handleAddCard({ number: cardNumber, expiryDate, cvv });
              }
            }}>
              Додати картку
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CheckoutPage;
