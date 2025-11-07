export default function Accounts() {
  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Accounts</h1>
      </div>
      <div className="col-6">
        <div className="card">
          <h2>Rename “Other”</h2>
          <input
            className="input"
            placeholder="e.g., Travel, Projects, Gifts"
          />
          <div style={{ marginTop: 10 }}>
            <button className="btn">Save Name</button>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="grid" style={{ gap: 10 }}>
            <div className="col-6">
              <button className="btn">Deposit</button>
            </div>
            <div className="col-6">
              <button className="btn ghost">Withdraw</button>
            </div>
          </div>
          <p style={{ marginTop: 8, color: "var(--muted)" }}>
            Actions are placeholders only.
          </p>
        </div>
      </div>
    </div>
  );
}
