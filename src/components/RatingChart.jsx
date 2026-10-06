import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const RatingChart = ({ distribution = {} }) => {
  const data = [5, 4, 3, 2, 1].map((rating) => ({
    label: `${rating} Star`,
    count: distribution[String(rating)] || 0,
  }));

  return (
    <section className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Rating distribution</h2>
        {!data.some((item) => item.count > 0) ? (
          <p className="text-secondary mb-0 py-4">No ratings for this date range yet.</p>
        ) : (
          <div style={{ width: '100%', height: 270 }}>
            <ResponsiveContainer>
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="label" width={72} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default RatingChart;
