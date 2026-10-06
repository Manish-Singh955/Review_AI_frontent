const metricCards = [
  { key: 'totalLocations', label: 'Total locations', format: (value) => value },
  { key: 'totalQrScans', label: 'QR scans', format: (value) => value.toLocaleString() },
  { key: 'totalRatings', label: 'Total ratings', format: (value) => value.toLocaleString() },
  { key: 'averageRating', label: 'Average rating', format: (value) => `${Number(value || 0).toFixed(1)} / 5` },
  { key: 'totalGoogleClicks', label: 'Google clicks', format: (value) => value.toLocaleString() },
  { key: 'totalPrivateFeedback', label: 'Private feedback', format: (value) => value.toLocaleString() },
];

const AnalyticsCards = ({ analytics = {} }) => (
  <div className="row g-3 mb-4">
    {metricCards.map(({ key, label, format }) => (
      <div className="col-12 col-sm-6 col-xl-4" key={key}>
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body">
            <p className="text-secondary small mb-2">{label}</p>
            <div className="fs-3 fw-semibold">{format(analytics[key] ?? 0)}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AnalyticsCards;
