import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalyticsCards from '../components/AnalyticsCards';
import RatingChart from '../components/RatingChart';
import RecentActivity from '../components/RecentActivity';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [range, setRange] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/analytics/dashboard', { params: { range } });
        if (active) setAnalytics(response.data.data || {});
        if (active) setError('');
      } catch (requestError) {
        if (!active) return;
        if (requestError.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(requestError.response?.data?.message || 'Analytics could not be loaded. Please try again.');
          setAnalytics({});
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    fetchAnalytics();
    return () => { active = false; };
  }, [token, range, navigate, logout]);

  if (loading) {
    return <main className="container py-5 text-center"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading analytics</span></div><p className="text-secondary mt-3">Loading dashboard...</p></main>;
  }

  return (
    <main className="container-fluid dashboard-page py-4 px-3 px-lg-4">
      <div className="dashboard-header mb-4">
        <div>
          <p className="eyebrow">ReviewAI</p>
          <h1>Welcome, {user?.name || 'User'}</h1>
        </div>
        <div className="date-range-control">
          <label className="form-label small mb-1" htmlFor="analytics-range">Date range</label>
          <select id="analytics-range" className="form-select" value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <AnalyticsCards analytics={analytics || {}} />
      <div className="row g-3">
        <div className="col-12"><RatingChart distribution={analytics?.ratingDistribution || {}} /></div>
      </div>
      <RecentActivity reviews={analytics?.recentReviews || []} feedback={analytics?.recentFeedback || []} />
    </main>
  );
};

export default Dashboard;
