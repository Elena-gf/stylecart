const API_URL = 'http://localhost:4000/api';


export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const url = params ? `${API_URL}/products?${params}` : `${API_URL}/products`;

  const response = await fetch(url);

  if (!response.ok) throw new Error('Error al obtener los productos');

  const data = await response.json();
  return data.data;
};

export const getProductById = async (idProduct) => {
  const response = await fetch(`${API_URL}/products/${idProduct}`);

  if (!response.ok) throw new Error('Producto no encontrado');

  const data = await response.json();
  return data.data;
};

export const getAllCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) throw new Error('Error al obtener las categorías');

  const data = await response.json();
  return data.data;
};


export const createProduct = async (token, productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al crear el producto');
  }

  const data = await response.json();
  return data.data;
};

export const updateProduct = async (token, id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) throw new Error('Error al actualizar el producto');

  const data = await response.json();
  return data.data;
};

export const deleteProduct = async (token, id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'auth-token': token },
  });

  if (!response.ok) throw new Error('Error al eliminar el producto');

  return response.json();
};