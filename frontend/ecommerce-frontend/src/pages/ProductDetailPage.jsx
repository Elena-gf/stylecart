import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { idProduct } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(idProduct)
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [idProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setError('');

    try {
      await addItem(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="product-detail__status">Loading...</p>;
  if (error && !product) return <p className="product-detail__status">{error}</p>;
  if (!product) return null;

  const outOfStock = product.stock === 0;

  return (
    <div className="product-detail">
      <div className="product-detail__image">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="product-detail__info">
        <h1>{product.name}</h1>
        <p className="product-detail__price">${product.price.toFixed(2)}</p>

        {(product.size || product.color) && (
          <p className="product-detail__meta">
            {product.size && <span>Size: {product.size}</span>}
            {product.size && product.color && ' · '}
            {product.color && <span>Color: {product.color}</span>}
          </p>
        )}

        <p className="product-detail__description">{product.description}</p>

        <p className={`product-detail__stock ${outOfStock ? 'product-detail__stock--out' : ''}`}>
          {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
        </p>

        {!outOfStock && (
          <div className="product-detail__quantity">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            />
          </div>
        )}

        {error && <p className="product-detail__error">{error}</p>}

        <button
          onClick={handleAddToCart}
          disabled={outOfStock || adding}
          className="product-detail__add-btn"
        >
          {outOfStock ? 'Out of stock' : adding ? 'Adding...' : added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;