export default function RecentTransactions({ transactions, accounts }) {
  const recentTransactions = transactions.slice(0, 10);

  const getAccountLabel = (accountNumber) => {
    const account = accounts.find((a) => a.account_number === accountNumber);
    return account ? account.label : `Account ${accountNumber}`;
  };

  const formatTransactionType = (type) => {
    switch (type) {
      case "transfer-in":
        return "Transfer In";
      case "transfer-out":
        return "Transfer Out";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getAmountColor = (type) => {
    if (type === "deposit" || type === "transfer-in") return "#51cf66";
    if (type === "withdrawal" || type === "transfer-out") return "#ff6b6b";
    return "var(--ink)";
  };

  const getAmountPrefix = (type) => {
    if (type === "deposit" || type === "transfer-in") return "+";
    if (type === "withdrawal" || type === "transfer-out") return "-";
    return "";
  };

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
                <td>{formatTransactionType(tx.type)}</td>
                <td>{getAccountLabel(tx.account_number)}</td>
                <td>
                  <span className="badge">{tx.category}</span>
                </td>
                <td style={{ color: getAmountColor(tx.type) }}>
                  {getAmountPrefix(tx.type)}${Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
