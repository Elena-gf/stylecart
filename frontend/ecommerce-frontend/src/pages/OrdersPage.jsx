import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import './OrdersPage.css';

const statusLabels = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders(token)
      .then(setOrders)
      .catch(() => setError('Could not load your orders'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="orders-page__status">Loading orders...</p>;
  if (error) return <p className="orders-page__status">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="orders-page__empty">
        <h1>My orders</h1>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My orders</h1>

      <div className="orders-page__list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card__header">
              <div>
                <p className="order-card__id">Order #{order._id.slice(-8)}</p>
                <p className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`order-card__status order-card__status--${order.status}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="order-card__items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-card__item">
                  <span>{item.product?.name || 'Product no longer available'} × {item.quantity}</span>
                  <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-card__footer">
              <span>Total</span>
              <span className="order-card__total">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;