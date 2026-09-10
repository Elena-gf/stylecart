import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((products) => setFeatured(products.slice(0, 4)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Everyday pieces, considered.</h1>
        <p>Simple, well-made clothing for the way you actually live.</p>
        <Link to="/products" className="hero__cta">Shop the collection</Link>
      </section>

      <section className="featured">
        <h2>New in</h2>

        {loading ? (
          <p>Loading...</p>
        ) : featured.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="featured__grid">
            {featured.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className="featured__card">
                <div className="featured__image">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;