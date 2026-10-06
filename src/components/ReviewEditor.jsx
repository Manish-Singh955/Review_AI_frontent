const ReviewEditor = ({ value, onChange, onRegenerate, onCopy, onContinue, copiedMessage, submitting }) => {
  return (
    <div className="review-editor">
      <h2 className="h4">Your generated review</h2>

      <label className="visually-hidden" htmlFor="generated-review">Edit your review</label>
      <textarea id="generated-review" value={value} onChange={onChange} className="editor-textarea" />

      <div className="editor-actions">
        <button type="button" className="secondary-button" onClick={onRegenerate} disabled={submitting}>
          {submitting ? 'Generating...' : 'Regenerate'}
        </button>
        <button type="button" className="secondary-button" onClick={onCopy} disabled={!value.trim() || submitting}>
          Copy Review
        </button>
        <button type="button" className="primary-button" onClick={onContinue} disabled={!value.trim() || submitting}>
          Copy & Continue to Google Review
        </button>
      </div>

      <p className="ai-review-instruction">Your review is copied automatically. On Google, choose your star rating, paste the review, and decide whether to submit it.</p>
      {copiedMessage && <div className="success-box">{copiedMessage}</div>}
    </div>
  );
};

export default ReviewEditor;
