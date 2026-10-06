const formatDate = (value) => value ? new Date(value).toLocaleString() : '';

const RecentActivity = ({ reviews = [], feedback = [] }) => (
  <div className="row g-3 mt-1" id="recent-reviews">
    <div className="col-12 col-lg-6">
      <section className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h2 className="h5 mb-3">Recent ratings</h2>
          {reviews.length === 0 ? <p className="text-secondary mb-0">No ratings yet.</p> : (
            <div className="list-group list-group-flush">
              {reviews.map((review) => (
                <div className="list-group-item px-0" key={review._id}>
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{review.rating} / 5</strong>
                    <small className="text-secondary">{formatDate(review.createdAt)}</small>
                  </div>
                  <div className="small text-secondary">{review.location?.name || 'Location'}</div>
                  <p className="mb-0 mt-1 text-break">{review.comment || 'No written comment.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    <div className="col-12 col-lg-6" id="recent-feedback">
      <section className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h2 className="h5 mb-3">Recent private feedback</h2>
          {feedback.length === 0 ? <p className="text-secondary mb-0">No private feedback yet.</p> : (
            <div className="list-group list-group-flush">
              {feedback.map((item) => (
                <div className="list-group-item px-0" key={item._id}>
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{item.rating} / 5 · {item.category}</strong>
                    <small className="text-secondary">{formatDate(item.createdAt)}</small>
                  </div>
                  <div className="small text-secondary">{item.location?.name || 'Location'} · {item.status}</div>
                  <p className="mb-0 mt-1 text-break">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  </div>
);

export default RecentActivity;
