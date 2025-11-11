import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function Categories() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getTransactions();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map((tx) => tx.category))];

  // Calculate category statistics
  const categoryStats = {};
  transactions.forEach((tx) => {
    if (!categoryStats[tx.category]) {
      categoryStats[tx.category] = {
        count: 0,
        totalIn: 0,
        totalOut: 0,
      };
    }
    categoryStats[tx.category].count++;

    if (tx.type === "deposit" || tx.type === "transfer-in") {
      categoryStats[tx.category].totalIn += tx.amount;
    } else if (tx.type === "withdrawal" || tx.type === "transfer-out") {
      categoryStats[tx.category].totalOut += tx.amount;
    }
  });

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading categories...
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Transaction Categories</h1>
      </div>

      <div className="col-6">
        <div className="card">
          <h2>How Categories Work</h2>
          <p style={{ color: "var(--muted)" }}>
            Categories are created automatically when you perform transactions.
            Simply enter a category name when depositing, withdrawing, or
            transferring money.
          </p>
          <p style={{ color: "var(--muted)", marginTop: 12 }}>
            Categories help you track where your money is going and organize
            your finances.
          </p>
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <h2>My Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>
              No categories yet. Create one by making a transaction!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              {categories.sort().map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                >
                  <span>{cat}</span>
                  <span className="badge">
                    {categoryStats[cat].count} transactions
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h2>Category Usage Statistics</h2>
          {Object.keys(categoryStats).length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No transaction data yet</p>
          ) : (
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
                {Object.entries(categoryStats)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([category, stats]) => {
                    const net = stats.totalIn - stats.totalOut;
                    return (
                      <tr key={category}>
                        <td>
                          <span className="badge">{category}</span>
                        </td>
                        <td>{stats.count}</td>
                        <td style={{ color: "#51cf66" }}>
                          +${stats.totalIn.toFixed(2)}
                        </td>
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
          )}
        </div>
      </div>
    </div>
  );
}
