import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function History() {
  const { user } = useAuth();
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = user.transactions.filter((tx) => {
    if (filterAccount !== "all" && tx.accountId !== parseInt(filterAccount)) {
      return false;
    }
    if (filterCategory && tx.category !== filterCategory) {
      return false;
    }
    if (startDate && new Date(tx.date) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(tx.date) > new Date(endDate + "T23:59:59")) {
      return false;
    }
    return true;
  });

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Transaction History</h1>
      </div>

      <div className="col-12 card" style={{ marginBottom: 16 }}>
        <h2>Filters</h2>
        <div className="grid" style={{ gap: 10 }}>
          <div className="col-3">
            <select
              className="select"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
            >
              <option value="all">All Accounts</option>
              {user.accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
            />
          </div>
          <div className="col-3">
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
            />
          </div>
          <div className="col-3">
            <select
              className="select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {user.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h2>Transactions ({filteredTransactions.length})</h2>
          {filteredTransactions.length === 0 ? (
            <p style={{ color: "var(--muted)", padding: "20px 0" }}>
              No transactions found
            </p>
          ) : (
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
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleString()}</td>
                    <td style={{ textTransform: "capitalize" }}>{tx.type}</td>
                    <td>{tx.account}</td>
                    <td>
                      <span className="badge">{tx.category}</span>
                    </td>
                    <td
                      style={{ color: tx.amount >= 0 ? "#51cf66" : "#ff6b6b" }}
                    >
                      {tx.amount >= 0 ? "+" : ""}$
                      {Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
