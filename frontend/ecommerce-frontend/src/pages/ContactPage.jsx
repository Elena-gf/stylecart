import { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="contact-page">
      <h1>Contact us</h1>
      <p className="contact-page__intro">
        Questions about an order, a product, or anything else? Send us a message.
      </p>

      {sent ? (
        <p className="contact-page__success">Thanks! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-page__form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </label>

          <button type="submit">Send message</button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;