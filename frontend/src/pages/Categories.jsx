export default function Categories() {
  return (
    <div className="grid">
      <div className="col-6">
        <div className="card">
          <h2>Create Category (Inline-style)</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="e.g., Food, Bills, Entertainment"
            />
            <button className="btn">Add</button>
          </div>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            New categories should appear instantly in money forms.
          </p>
        </div>
      </div>
      <div className="col-6">
        <div className="card">
          <h2>My Categories</h2>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: "1.9" }}>
            <li>Food</li>
            <li>Bills</li>
            <li>Entertainment</li>
            <li>Savings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
