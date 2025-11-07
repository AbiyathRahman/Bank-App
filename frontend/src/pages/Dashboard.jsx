import AccountCard from "../components/AccountCard.jsx";
import TransactionTable from "../components/TransactionTable.jsx";

export default function Dashboard() {
  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Dashboard</h1>
      </div>
      <div className="col-4">
        <AccountCard name="Checking" balance="$1,245.67" number="1" />
      </div>
      <div className="col-4">
        <AccountCard name="Savings" balance="$3,420.00" number="2" />
      </div>
      <div className="col-4">
        <AccountCard name="Other (Trips)" balance="$250.00" number="3" />
      </div>

      <div className="col-8">
        <TransactionTable />
      </div>

      <div className="col-4">
        <div className="card">
          <h2>Spending by Category</h2>
          <p>(Chart placeholder)</p>
          <div
            style={{
              height: 180,
              border: "1px dashed var(--border)",
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              color: "var(--muted)",
            }}
          >
            chart goes here
          </div>
        </div>
      </div>
    </div>
  );
}
