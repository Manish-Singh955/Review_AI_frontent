import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const initialForm = {
  businessName: '',
  category: '',
  logo: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  businessHours: '',
};

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get('/business');
        const business = response.data.business;

        if (business) {
          setFormData({
            businessName: business.businessName || '',
            category: business.category || '',
            logo: business.logo || '',
            description: business.description || '',
            phone: business.phone || '',
            email: business.email || '',
            website: business.website || '',
            address: business.address || '',
            businessHours: business.businessHours || '',
          });
          setIsEditing(true);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Could not load business profile.');
        }
      }
    };

    fetchBusiness();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (isEditing) {
        const response = await api.put('/business', formData);
        setMessage(response.data.message || 'Business profile updated successfully.');
      } else {
        const response = await api.post('/business', formData);
        setMessage(response.data.message || 'Business profile saved successfully.');
        setIsEditing(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Business</p>
          <h1>Business Profile</h1>
        </div>
        <button className="secondary-button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="form-card">
        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="styled-form">
          <div className="form-grid">
            <div className="field-group">
              <label>Business Name</label>
              <input name="businessName" value={formData.businessName} onChange={handleChange} required />
            </div>

            <div className="field-group">
              <label>Category</label>
              <input name="category" value={formData.category} onChange={handleChange} required />
            </div>

            <div className="field-group">
              <label>Logo URL</label>
              <input name="logo" value={formData.logo} onChange={handleChange} />
            </div>

            <div className="field-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="field-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="field-group">
              <label>Website</label>
              <input name="website" value={formData.website} onChange={handleChange} />
            </div>

            <div className="field-group full-width">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="field-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="field-group full-width">
              <label>Business Hours</label>
              <input name="businessHours" value={formData.businessHours} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="primary-button" style={{ marginTop: '20px' }}>
            {isEditing ? 'Update Business' : 'Save Business'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;
