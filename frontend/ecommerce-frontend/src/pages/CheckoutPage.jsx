import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const order = await createOrder(token, shippingAddress);
      setConfirmedOrder(order);
      await fetchCart(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  if (confirmedOrder) {
    return (
      <div className="checkout-confirmation">
        <h1>Order confirmed!</h1>
        <p>Thanks for your purchase. Your order total was <strong>${confirmedOrder.totalPrice.toFixed(2)}</strong>.</p>
        <p className="checkout-confirmation__id">Order ID: {confirmedOrder._id}</p>
        <div className="checkout-confirmation__actions">
          <Link to="/orders">View my orders</Link>
          <Link to="/products">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page__empty">
        <h1>Your cart is empty</h1>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__summary">
        {cart.map((item) => (
          <div key={item._id} className="checkout-page__row">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-page__row checkout-page__row--total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-page__form">
        <label>
          Shipping address
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Street, city, postal code..."
            rows={3}
            required
          />
        </label>

        {error && <p className="checkout-page__error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;