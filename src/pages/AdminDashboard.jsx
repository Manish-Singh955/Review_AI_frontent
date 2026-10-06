import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const statItems = [
  ['totalUsers', 'Users'],
  ['totalBusinesses', 'Businesses'],
  ['totalLocations', 'Locations'],
  ['totalReviews', 'Ratings'],
  ['totalFeedback', 'Feedback'],
  ['totalQrScans', 'QR scans'],
];

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [statsResponse, usersResponse, businessesResponse, locationsResponse, feedbackResponse] = await Promise.all([
          api.get('/admin/statistics'),
          api.get('/admin/users'),
          api.get('/admin/businesses'),
          api.get('/admin/locations'),
          api.get('/admin/feedback'),
        ]);
        setStatistics(statsResponse.data.data || {});
        setUsers(usersResponse.data.data || []);
        setBusinesses(businessesResponse.data.data || []);
        setLocations(locationsResponse.data.data || []);
        setFeedback(feedbackResponse.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load administration data.');
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const query = search.trim().toLowerCase();
  const visibleUsers = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query)), [users, query]);
  const visibleBusinesses = useMemo(() => businesses.filter((business) => `${business.businessName} ${business.owner?.name || ''}`.toLowerCase().includes(query)), [businesses, query]);
  const visibleLocations = useMemo(() => locations.filter((location) => `${location.business?.businessName || ''} ${location.name}`.toLowerCase().includes(query)), [locations, query]);
  const visibleFeedback = useMemo(() => feedback.filter((item) => `${item.business?.businessName || ''} ${item.category} ${item.message}`.toLowerCase().includes(query)), [feedback, query]);

  if (loading) return <div className="container py-5"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading</span></div></div>;

  return (
    <main className="container-fluid admin-dashboard py-4 px-3 px-lg-4">
      <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div><p className="eyebrow mb-1">Administration</p><h1 className="h2 mb-0">Platform overview</h1></div>
        <input className="form-control admin-search" type="search" placeholder="Search tables" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search admin tables" />
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4" id="statistics">
        {statItems.map(([key, label]) => (
          <div className="col-6 col-md-4 col-xl-2" key={key}>
            <div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="text-secondary small">Total {label}</div><div className="fs-3 fw-semibold">{(statistics[key] || 0).toLocaleString()}</div></div></div>
          </div>
        ))}
      </div>

      <section className="card border-0 shadow-sm mb-4" id="users">
        <div className="card-body"><h2 className="h5">Users</h2>
          <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead><tbody>
            {visibleUsers.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td><span className="badge text-bg-light">{user.role}</span></td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}
            {!visibleUsers.length && <tr><td colSpan="4" className="text-center text-secondary py-4">No users found.</td></tr>}
          </tbody></table></div>
        </div>
      </section>

      <section className="card border-0 shadow-sm mb-4" id="businesses">
        <div className="card-body"><h2 className="h5">Businesses</h2>
          <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Business</th><th>Owner</th><th>Category</th><th>Created</th></tr></thead><tbody>
            {visibleBusinesses.map((business) => <tr key={business._id}><td>{business.businessName}</td><td>{business.owner?.name || 'Unknown'}</td><td>{business.category}</td><td>{new Date(business.createdAt).toLocaleDateString()}</td></tr>)}
            {!visibleBusinesses.length && <tr><td colSpan="4" className="text-center text-secondary py-4">No businesses found.</td></tr>}
          </tbody></table></div>
        </div>
      </section>

      <section className="card border-0 shadow-sm mb-4" id="locations">
        <div className="card-body"><h2 className="h5">Locations</h2>
          <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Business</th><th>Location</th><th>Status</th><th>Created</th></tr></thead><tbody>
            {visibleLocations.map((location) => <tr key={location._id}><td>{location.business?.businessName || 'Unknown'}</td><td>{location.name}</td><td><span className={`badge ${location.isActive ? 'text-bg-success' : 'text-bg-secondary'}`}>{location.isActive ? 'Active' : 'Inactive'}</span></td><td>{new Date(location.createdAt).toLocaleDateString()}</td></tr>)}
            {!visibleLocations.length && <tr><td colSpan="4" className="text-center text-secondary py-4">No locations found.</td></tr>}
          </tbody></table></div>
        </div>
      </section>

      <section className="card border-0 shadow-sm" id="feedback">
        <div className="card-body"><h2 className="h5">Feedback</h2>
          <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Business</th><th>Rating</th><th>Category</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead><tbody>
            {visibleFeedback.map((item) => <tr key={item._id}><td>{item.business?.businessName || 'Unknown'}</td><td>{item.rating}</td><td>{item.category}</td><td>{item.priority}</td><td>{item.status}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}
            {!visibleFeedback.length && <tr><td colSpan="6" className="text-center text-secondary py-4">No feedback found.</td></tr>}
          </tbody></table></div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
