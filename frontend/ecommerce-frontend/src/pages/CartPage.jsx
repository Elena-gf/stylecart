import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCart();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleQuantityChange = (itemId, value, stock) => {
    const qty = Math.max(1, Math.min(stock, Number(value)));
    updateItem(itemId, qty);
  };

  if (loading) return <p className="cart-page__status">Loading cart...</p>;

  if (cart.length === 0) {
    return (
      <div className="cart-page__empty">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="cart-page__browse-link">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>

      <div className="cart-page__list">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item__image">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0]} alt={item.product.name} />
              ) : (
                <span>No image</span>
              )}
            </div>

            <div className="cart-item__info">
              <Link to={`/products/${item.product._id}`} className="cart-item__name">
                {item.product.name}
              </Link>
              {(item.product.size || item.product.color) && (
                <p className="cart-item__meta">
                  {item.product.size} {item.product.color && `· ${item.product.color}`}
                </p>
              )}
              <p className="cart-item__price">${item.product.price.toFixed(2)}</p>
            </div>

            <button
              onClick={() => removeItem(item._id)}
              className="cart-item__remove"
              aria-label={`Remove ${item.product.name} from cart`}
            >
              ✕
            </button>

            <div className="cart-item__bottom">
              <div className="cart-item__quantity">
                <label htmlFor={`qty-${item._id}`}>Qty</label>
                <input
                  id={`qty-${item._id}`}
                  type="number"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value, item.product.stock)}
                />
              </div>

              <p className="cart-item__subtotal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-page__summary">
        <p className="cart-page__total">Total: <strong>${total.toFixed(2)}</strong></p>
        <Link to="/checkout" className="cart-page__checkout-btn">Checkout</Link>
      </div>
    </div>
  );
};

export default CartPage;