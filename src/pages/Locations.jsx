import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../components/QRCodeGenerator';
import api from '../services/api';

const Locations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLocations = async (searchTerm = search) => {
    try {
      const response = await api.get('/locations', { params: { search: searchTerm } });
      setLocations(response.data.locations || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => fetchLocations(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const toggleLocationStatus = async (location) => {
    try {
      await api.put(`/locations/${location._id}`, {
        ...location,
        isActive: !location.isActive,
      });
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update location status.');
    }
  };

  const deactivateLocation = async (locationId) => {
    try {
      await api.delete(`/locations/${locationId}`);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate location.');
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading-box">Loading locations...</div></div>;
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Locations</p>
          <h1>Manage Locations</h1>
        </div>
        <button className="primary-button" onClick={() => navigate('/locations/add')}>
          + Add Location
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="locations-search">
        <input
          className="form-control"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company, location, address, or QR code"
          aria-label="Search company and locations"
        />
      </div>

      <div className="locations-grid">
        {locations.length === 0 ? (
          <div className="empty-box">No locations added yet.</div>
        ) : locations.length === 0 ? (
          <div className="empty-box">No matching company or locations found.</div>
        ) : (
          locations.map((location) => (
            <div className="location-card" key={location._id}>
              <div className="card-top-row">
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                </div>
                <span className={`status-badge ${location.isActive ? 'active' : 'inactive'}`}>
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="location-meta">
                <strong>Google Review URL:</strong>
                <a href={location.googleReviewUrl} target="_blank" rel="noreferrer">
                  {location.googleReviewUrl}
                </a>
              </div>

              <div className="location-meta">
                <strong>QR Code:</strong>
                <span>{location.qrCode}</span>
              </div>

              <QRCodeGenerator qrCode={location.qrCode} />

              <div className="card-actions">
                <Link to={`/locations/edit/${location._id}`} className="secondary-button link-button-secondary">
                  Edit
                </Link>
                <button className="secondary-button" onClick={() => toggleLocationStatus(location)}>
                  {location.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="danger-button" onClick={() => deactivateLocation(location._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Locations;
