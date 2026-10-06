import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
import ReviewEditor from '../components/ReviewEditor';
import ReviewSuggestions from '../components/ReviewSuggestions';

const experienceOptions = ['Food', 'Service', 'Staff', 'Cleanliness', 'Price', 'Atmosphere'];
const LOW_RATING_THRESHOLD = 3;

const CustomerReview = () => {
  const { qrCode } = useParams();
  const [business, setBusiness] = useState(null);
  const [location, setLocation] = useState(null);
  const [rating, setRating] = useState(0);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [comment, setComment] = useState('');
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('service');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [screen, setScreen] = useState('form');
  const [lastGeneratedAt, setLastGeneratedAt] = useState(0);
  const [ratingRecorded, setRatingRecorded] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchReviewPage = async () => {
      try {
        const response = await api.get(`/reviews/qr/${qrCode}`);
        setBusiness(response.data.business);
        setLocation(response.data.location);
      } catch (err) {
        setError(err.response?.data?.message || 'This QR code is invalid or inactive.');
      }
    };

    fetchReviewPage();
  }, [qrCode]);

  const handleExperienceToggle = (item) => {
    setSelectedExperiences((prev) =>
      prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]
    );
  };

  const generateReview = async (isRegenerate = false) => {
    if (!rating) {
      setError('Please select a rating from 1 to 5 stars.');
      return;
    }

    if (!comment.trim()) {
      setError('Please share your experience in the comment field.');
      return;
    }

    if (rating <= LOW_RATING_THRESHOLD) {
      setScreen('feedback');
      return;
    }

    const now = Date.now();
    if (!isRegenerate && now - lastGeneratedAt < 5000) {
      setError('Please wait a moment before generating another review.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmittingReview(true);

    try {
      if (!ratingRecorded) {
        await api.post('/reviews/rating', {
          qrCode,
          rating,
          experiences: selectedExperiences,
          comment,
          language,
        });
        setRatingRecorded(true);
      }

      const response = await api.post('/reviews/generate', {
        qrCode,
        rating,
        experiences: selectedExperiences,
        comment,
        language,
      });

      const generatedSuggestions = response.data.suggestions || [];
      setSuggestions(generatedSuggestions);
      setSelectedSuggestionIndex(0);
      setReviewText(generatedSuggestions[0] || '');
      setLastGeneratedAt(now);
      setScreen('suggestions');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate review suggestions.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSelectSuggestion = (index) => {
    setSelectedSuggestionIndex(index);
    setReviewText(suggestions[index]);
    setScreen('editor');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopiedMessage('Review copied successfully!');
    } catch (err) {
      setCopiedMessage('Copy failed. Please copy manually.');
    }
  };

  const handleGoogleClick = async () => {
    try {
      const response = await api.post('/reviews/google-click', { qrCode });
      window.location.href = response.data.googleReviewUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not continue to Google review.');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (submittingFeedback) return;

    if (!feedbackMessage.trim()) {
      setError('Please tell us what went wrong so we can improve.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const response = await api.post('/feedback', {
        qrCode,
        rating,
        category: feedbackCategory,
        message: feedbackMessage,
      });

      setSuccess(response.data.message || 'Thank you for your feedback.');
      setScreen('feedback-success');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Feedback submission failed.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="customer-review-page">
      <div className="customer-review-card">
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        {!business || !location ? (
          !error ? (
            <div className="loading-box">Loading review page...</div>
          ) : null
        ) : screen === 'form' ? (
          <>
            <div className="customer-header">
              {business.logo ? (
                <img src={business.logo} alt={business.businessName} className="business-logo" />
              ) : (
                <div className="business-logo placeholder-logo">{business.businessName?.[0]}</div>
              )}

              <div>
                <h1>{business.businessName}</h1>
                <p>{location.name}</p>
                <p>{location.address}</p>
              </div>
            </div>

            <p className="business-description">{business.description || 'We value your feedback.'}</p>

            <div className="review-form">
              <div className="rating-row">
                <label>How was your experience?</label>
                <div className="star-selector">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= rating ? 'star selected' : 'star'}
                      onClick={() => setRating(value)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="experience-section">
                <label>What did you like?</label>
                <div className="experience-grid">
                  {experienceOptions.map((item) => (
                    <label key={item} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={selectedExperiences.includes(item)}
                        onChange={() => handleExperienceToggle(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <label>Tell us about your experience</label>
                <textarea
                  placeholder="Tell us about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <button type="button" className="primary-button" onClick={() => generateReview()} disabled={submittingReview}>
                {submittingReview ? 'Working...' : rating <= LOW_RATING_THRESHOLD ? 'Submit Feedback' : 'Generate Review'}
              </button>
            </div>
          </>
        ) : screen === 'suggestions' ? (
          <>
            <h2>Choose your review</h2>
            <ReviewSuggestions
              suggestions={suggestions}
              selectedIndex={selectedSuggestionIndex}
              onSelect={handleSelectSuggestion}
            />
          </>
        ) : screen === 'editor' ? (
          <ReviewEditor
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            onRegenerate={() => generateReview(true)}
            onCopy={handleCopy}
            onContinue={handleGoogleClick}
            copiedMessage={copiedMessage}
          />
        ) : screen === 'feedback' ? (
          <FeedbackForm
            rating={rating}
            category={feedbackCategory}
            setCategory={setFeedbackCategory}
            message={feedbackMessage}
            setMessage={setFeedbackMessage}
            onSubmit={handleFeedbackSubmit}
            submitting={submittingFeedback}
          />
        ) : (
          <div className="success-box">
            <h3>Thank you for your feedback.</h3>
            <p>Your feedback has been sent to the business.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReview;
