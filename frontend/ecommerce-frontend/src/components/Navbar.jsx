import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="navbar">
      <div className="navbar__row">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>ANELE</Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="navbar__links navbar__links--desktop">
          <Link to="/products">Shop</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="navbar__actions navbar__actions--desktop">
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/profile">{user.name}</Link>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}

          <Link to="/cart" className="navbar__cart">
            Cart{cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="navbar__mobile-menu">
          <Link to="/products" onClick={closeMenu}>Shop</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/cart" onClick={closeMenu}>
            Cart{cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>

          <hr />

          {user ? (
            <>
              <Link to="/orders" onClick={closeMenu}>Orders</Link>
              <Link to="/profile" onClick={closeMenu}>{user.name}</Link>
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" onClick={closeMenu}>Sign up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;