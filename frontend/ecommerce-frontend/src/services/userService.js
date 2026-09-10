const API_URL = 'http://localhost:4000/api';

export const updateProfile = async (token, profileData) => {
  const response = await fetch(`${API_URL}/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Error al actualizar el perfil');
  }

  const data = await response.json();
  return data.data;
};