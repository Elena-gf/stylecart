import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/productService';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories'));
  }, []);

 
  useEffect(() => {
    setLoading(true);
    const filters = selectedCategory ? { category: selectedCategory } : {};

    getAllProducts(filters)
      .then(setProducts)
      .catch(() => setError('Could not load products'))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="product-list">
      <div className="product-list__header">
        <h1>Shop</h1>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="product-list__filter"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="product-list__error">{error}</p>}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-list__grid">
          {products.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="product-card"
            >
              <div className="product-card__image-placeholder">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <h3>{product.name}</h3>
              <p className="product-card__price">${product.price.toFixed(2)}</p>
              {product.size && <p className="product-card__meta">{product.size} · {product.color}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;