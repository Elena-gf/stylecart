import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);

    try {
      const updatedUser = await updateProfile(token, { name, address });
      updateUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>My profile</h1>

      <form onSubmit={handleSubmit} className="profile-page__form">
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
          <input type="email" value={user?.email || ''} disabled />
        </label>

        <label>
          Address
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Street, city, postal code..."
          />
        </label>

        {error && <p className="profile-page__error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;