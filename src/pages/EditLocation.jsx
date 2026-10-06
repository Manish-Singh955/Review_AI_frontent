import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditLocation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    googleReviewUrl: '',
    googlePlaceId: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.get(`/locations/${id}`);
        const location = response.data.location;

        setFormData({
          name: location.name,
          address: location.address,
          googleReviewUrl: location.googleReviewUrl,
          googlePlaceId: location.googlePlaceId || '',
          isActive: location.isActive,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this location.');
      }
    };

    fetchLocation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.put(`/locations/${id}`, formData);
      navigate('/locations');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update location.');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Locations</p>
          <h1>Edit Location</h1>
        </div>
        <button className="secondary-button" onClick={() => navigate('/locations')}>
          Back to Locations
        </button>
      </div>

      <div className="form-card">
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

            <div className="field-group full-width checkbox-row">
              <label>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                Active
              </label>
            </div>
          </div>

          <button type="submit" className="primary-button" style={{ marginTop: '20px' }}>
            Update Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLocation;
