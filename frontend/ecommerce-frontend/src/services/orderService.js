const API_URL = 'http://localhost:4000/api';

export const createOrder = async (token, shippingAddress) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({ shippingAddress }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear el pedido');
  }

  const data = await response.json();
  return data.data;
};

export const getMyOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders/my-orders`, {
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Error al obtener tus pedidos');

  const data = await response.json();
  return data.data;
};

export const getOrderById = async (token, id) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Pedido no encontrado');

  const data = await response.json();
  return data.data;
};

// Solo admin
export const getAllOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Error al obtener los pedidos');

  const data = await response.json();
  return data.data;
};

export const updateOrderStatus = async (token, id, status) => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error('Error al actualizar el estado del pedido');

  const data = await response.json();
  return data.data;
};