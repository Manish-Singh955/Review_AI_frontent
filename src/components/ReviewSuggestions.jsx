const ReviewSuggestions = ({ suggestions, selectedIndex, onSelect }) => {
  return (
    <div className="review-suggestions">
      <h3>Choose your review</h3>

      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion}-${index}`}
          className={`suggestion-card ${selectedIndex === index ? 'selected' : ''}`}
        >
          <p>{suggestion}</p>
          <button type="button" className="secondary-button" onClick={() => onSelect(index)}>
            Select
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReviewSuggestions;
