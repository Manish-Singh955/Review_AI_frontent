const FeedbackForm = ({ rating, category, setCategory, message, setMessage, onSubmit, submitting }) => {
  return (
    <div className="feedback-box">
      <h3>We&apos;re sorry to hear that.</h3>
      <p>Please help us understand what went wrong.</p>

      <div className="field-group">
        <label>Rating</label>
        <div className="rating-display">{Array.from({ length: 5 }, (_, index) => index < rating ? '★' : '☆').join(' ')}</div>
      </div>

      <div className="field-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="service">Service</option>
          <option value="food">Food</option>
          <option value="staff">Staff</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="price">Price</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="field-group">
        <label>What happened?</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what went wrong so we can improve."
        />
      </div>

      <button type="button" className="primary-button" onClick={onSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
};

export default FeedbackForm;
