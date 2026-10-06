import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const initialForm = {
  name: '',
  address: '',
  googleReviewUrl: '',
  googlePlaceId: '',
};

const AddLocation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/locations', formData);
      setMessage(response.data.message || 'Location added successfully.');
      setTimeout(() => navigate('/locations'), 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add location.');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Locations</p>
          <h1>Add Location</h1>
        </div>
        <button className="secondary-button" onClick={() => navigate('/locations')}>
          Back to Locations
        </button>
      </div>

      <div className="form-card">
        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="styled-form">
          <div className="form-grid">
            <div className="field-group full-width">
              <label>Location Name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="field-group full-width">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="field-group full-width">
              <label>Google Review URL</label>
              <input name="googleReviewUrl" value={formData.googleReviewUrl} onChange={handleChange} required />
            </div>

            <div className="field-group full-width">
              <label>Google Place ID</label>
              <input name="googlePlaceId" value={formData.googlePlaceId} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="primary-button" style={{ marginTop: '20px' }}>
            Save Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
