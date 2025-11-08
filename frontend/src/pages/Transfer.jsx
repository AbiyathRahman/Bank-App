export default function Transfer() {
  return (
    <div className="card">
      <h1 className="section-title">Transfer</h1>

      <h2>Within My Accounts</h2>
      <div className="grid" style={{ gap: 10, marginBottom: 16 }}>
        <div className="col-6">
          <select className="select">
            <option>From: Checking (1)</option>
            <option>From: Savings (2)</option>
            <option>From: Other (3)</option>
          </select>
        </div>
        <div className="col-6">
          <select className="select">
            <option>To: Savings (2)</option>
            <option>To: Checking (1)</option>
            <option>To: Other (3)</option>
          </select>
        </div>
        <div className="col-6">
          <input className="input" placeholder="Amount" />
        </div>
        <div className="col-6">
          <input className="input" placeholder="Category (create inline)" />
        </div>
        <div className="col-12">
          <button className="btn">Transfer</button>
        </div>
      </div>

      <h2>To Another User</h2>
      <div className="grid" style={{ gap: 10 }}>
        <div className="col-4">
          <input className="input" placeholder="Target User ID" />
        </div>
        <div className="col-4">
          <input className="input" placeholder="Target Account # (1/2/3)" />
        </div>
        <div className="col-4">
          <input className="input" placeholder="Amount" />
        </div>
        <div className="col-8">
          <input className="input" placeholder="Category (create inline)" />
        </div>
        <div className="col-4">
          <button className="btn">Send</button>
        </div>
      </div>
    </div>
  );
}
