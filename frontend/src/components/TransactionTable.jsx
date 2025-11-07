export default function TransactionTable() {
  // placeholder rows
  const rows = [
    {
      date: "2025-11-07 10:31",
      type: "Deposit",
      account: "Checking",
      amount: "+$120.00",
      category: "Paycheck",
    },
    {
      date: "2025-11-06 18:02",
      type: "Withdrawal",
      account: "Checking",
      amount: "-$25.00",
      category: "Food",
    },
    {
      date: "2025-11-05 09:10",
      type: "Transfer",
      account: "Checking → Savings",
      amount: "-$50.00",
      category: "Savings",
    },
  ];
  return (
    <div className="card">
      <h2>Recent Transactions</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Type</th>
            <th>Account(s)</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.type}</td>
              <td>{r.account}</td>
              <td>
                <span className="badge">{r.category}</span>
              </td>
              <td>{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
