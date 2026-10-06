const ReviewEditor = ({ value, onChange, onRegenerate, onCopy, onContinue, copiedMessage }) => {
  return (
    <div className="review-editor">
      <h3>Edit Your Review</h3>

      <textarea value={value} onChange={onChange} className="editor-textarea" />

      <div className="editor-actions">
        <button type="button" className="secondary-button" onClick={onRegenerate}>
          Regenerate
        </button>
        <button type="button" className="secondary-button" onClick={onCopy}>
          Copy Review
        </button>
        <button type="button" className="primary-button" onClick={onContinue}>
          Continue to Google Review
        </button>
      </div>

      {copiedMessage && <div className="success-box">{copiedMessage}</div>}
    </div>
  );
};

export default ReviewEditor;
