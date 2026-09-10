import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <span className="footer__logo">ANELE</span>

        <nav className="footer__links">
          <Link to="/products">Shop</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <p className="footer__bottom">© {year} ANELE. All rights reserved.</p>
    </footer>
  );
};

export default Footer;