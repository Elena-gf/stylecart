const API_URL = 'http://localhost:4000/api';

export const getCart = async (token) => {
  const response = await fetch(`${API_URL}/user/cart`, {
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Error al obtener el carrito');

  const data = await response.json();
  return data.data;
};

export const addToCart = async (token, productId, quantity) => {
  const response = await fetch(`${API_URL}/user/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al añadir al carrito');
  }

  const data = await response.json();
  return data.data;
};

export const updateCartItem = async (token, itemId, quantity) => {
  const response = await fetch(`${API_URL}/user/cart/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) throw new Error('Error al actualizar el carrito');

  const data = await response.json();
  return data.data;
};

export const removeFromCart = async (token, itemId) => {
  const response = await fetch(`${API_URL}/user/cart/${itemId}`, {
    method: 'DELETE',
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Error al eliminar del carrito');

  return response.json();
};