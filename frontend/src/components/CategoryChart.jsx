export default function CategoryChart({ transactions }) {
  // Calculate spending by category (only withdrawals and transfer-outs)
  const categoryTotals = {};

  transactions.forEach((tx) => {
    if (tx.type === "withdrawal" || tx.type === "transfer-out") {
      if (!categoryTotals[tx.category]) {
        categoryTotals[tx.category] = 0;
      }
      categoryTotals[tx.category] += Math.abs(tx.amount);
    }
  });

  const total = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div className="card">
      <h2>Spending by Category</h2>
      {total === 0 ? (
        <p style={{ color: "var(--muted)", padding: "20px 0" }}>
          No spending data yet
        </p>
      ) : (
        <div style={{ marginTop: 16 }}>
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1]) // Sort by amount descending
            .map(([category, amount]) => {
              const percentage = ((amount / total) * 100).toFixed(1);
              return (
                <div key={category} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span>{category}</span>
                    <span>
                      ${amount.toFixed(2)} ({percentage}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "var(--border)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: "var(--accent)",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
