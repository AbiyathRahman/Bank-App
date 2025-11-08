import TransactionTable from "../components/TransactionTable.jsx";

export default function History() {
  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">History</h1>
      </div>

      <div className="col-12 card" style={{ marginBottom: 16 }}>
        <h2>Filters</h2>
        <div className="grid" style={{ gap: 10 }}>
          <div className="col-3">
            <select className="select">
              <option>All Accounts</option>
              <option>Checking</option>
              <option>Savings</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-3">
            <input className="input" type="date" />
          </div>
          <div className="col-3">
            <input className="input" type="date" />
          </div>
          <div className="col-3">
            <input className="input" placeholder="Category" />
          </div>
        </div>
      </div>

      <div className="col-12">
        <TransactionTable />
      </div>

      <div
        className="col-12"
        style={{ display: "flex", justifyContent: "center", marginTop: 12 }}
      >
        <button className="btn ghost">Load More</button>
      </div>
    </div>
  );
}
