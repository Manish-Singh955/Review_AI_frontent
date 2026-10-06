import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const categoryOptions = ['all', 'service', 'food', 'staff', 'cleanliness', 'price', 'other'];
const priorityOptions = ['all', 'low', 'medium', 'high'];
const statusOptions = ['all', 'new', 'in_progress', 'resolved'];

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      const response = await api.get('/feedback');
      setFeedbackList(response.data.feedback || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load feedback inbox.');
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchesSearch = (item.message || '').toLowerCase().includes(search.toLowerCase());
      const matchesRating = ratingFilter === 'all' || String(item.rating) === ratingFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesRating && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [feedbackList, search, ratingFilter, categoryFilter, priorityFilter, statusFilter]);

  const updateFeedbackValue = async (id, key, value) => {
    try {
      await api.put(`/feedback/${id}/${key}`, { [key === 'status' ? 'status' : key === 'priority' ? 'priority' : 'category']: value });
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update feedback.');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Feedback</p>
          <h1>Business Feedback Inbox</h1>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="feedback-toolbar form-card">
        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="all">All Ratings</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>{option === 'all' ? 'All Categories' : option}</option>
          ))}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {priorityOptions.map((option) => (
            <option key={option} value={option}>{option === 'all' ? 'All Priorities' : option}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option === 'all' ? 'All Status' : option}</option>
          ))}
        </select>
      </div>

      <div className="feedback-grid">
        {filteredFeedback.length === 0 ? (
          <div className="empty-box">No feedback found.</div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item._id} className="feedback-card">
              <div className="feedback-top-row">
                <span className="feedback-badge">Rating: {item.rating}</span>
                <span className={`status-badge ${item.status === 'resolved' ? 'active' : 'inactive'}`}>
                  {item.status}
                </span>
              </div>

              <div className="feedback-row">
                <strong>Category:</strong>
                <select
                  value={item.category}
                  onChange={(e) => updateFeedbackValue(item._id, 'category', e.target.value)}
                >
                  {categoryOptions.filter((option) => option !== 'all').map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="feedback-row">
                <strong>Priority:</strong>
                <select
                  value={item.priority}
                  onChange={(e) => updateFeedbackValue(item._id, 'priority', e.target.value)}
                >
                  {priorityOptions.filter((option) => option !== 'all').map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="feedback-row">
                <strong>Status:</strong>
                <select
                  value={item.status}
                  onChange={(e) => updateFeedbackValue(item._id, 'status', e.target.value)}
                >
                  {statusOptions.filter((option) => option !== 'all').map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="feedback-row">
                <strong>Sentiment:</strong>
                <span>{item.sentiment}</span>
              </div>

              <div className="feedback-row">
                <strong>Location:</strong>
                <span>{item.location?.name || 'Unknown'}</span>
              </div>

              <p className="feedback-message">{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;
