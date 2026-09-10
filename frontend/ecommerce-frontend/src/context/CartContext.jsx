import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as addToCartService, updateCartItem, removeFromCart as removeFromCartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart(token);
      setCart(data);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    const updatedCart = await addToCartService(token, productId, quantity);
    setCart(updatedCart);
  };

  const updateItem = async (itemId, quantity) => {
    const updatedCart = await updateCartItem(token, itemId, quantity);
    setCart(updatedCart);
  };

  const removeItem = async (itemId) => {
    await removeFromCartService(token, itemId);
    setCart(cart.filter(item => item._id !== itemId));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);