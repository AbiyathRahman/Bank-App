import { useAuth } from "../contexts/AuthContext";

export default function CategoryUsageStats() {
  const { user } = useAuth();

  const categoryStats = {};
  user.transactions.forEach((tx) => {
    if (!categoryStats[tx.category]) {
      categoryStats[tx.category] = {
        count: 0,
        totalIn: 0,
        totalOut: 0,
      };
    }
    categoryStats[tx.category].count++;
    if (tx.amount >= 0) {
      categoryStats[tx.category].totalIn += tx.amount;
    } else {
      categoryStats[tx.category].totalOut += Math.abs(tx.amount);
    }
  });

  if (Object.keys(categoryStats).length === 0) {
    return <p style={{ color: "var(--muted)" }}>No transaction data yet</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Transactions</th>
          <th>Total In</th>
          <th>Total Out</th>
          <th>Net</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(categoryStats).map(([category, stats]) => {
          const net = stats.totalIn - stats.totalOut;
          return (
            <tr key={category}>
              <td>
                <span className="badge">{category}</span>
              </td>
              <td>{stats.count}</td>
              <td style={{ color: "#51cf66" }}>+${stats.totalIn.toFixed(2)}</td>
              <td style={{ color: "#ff6b6b" }}>
                -${stats.totalOut.toFixed(2)}
              </td>
              <td style={{ color: net >= 0 ? "#51cf66" : "#ff6b6b" }}>
                {net >= 0 ? "+" : ""}${net.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
