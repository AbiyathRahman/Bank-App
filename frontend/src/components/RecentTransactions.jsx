import { useAuth } from "../contexts/AuthContext";

export default function RecentTransactions() {
  const { user } = useAuth();
  const recentTransactions = user.transactions.slice(0, 10);

  return (
    <div className="card">
      <h2>Recent Transactions</h2>
      {recentTransactions.length === 0 ? (
        <p style={{ color: "var(--muted)", padding: "20px 0" }}>
          No transactions yet
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Type</th>
              <th>Account</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td style={{ textTransform: "capitalize" }}>{tx.type}</td>
                <td>{tx.account}</td>
                <td>
                  <span className="badge">{tx.category}</span>
                </td>
                <td style={{ color: tx.amount >= 0 ? "#51cf66" : "#ff6b6b" }}>
                  {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
