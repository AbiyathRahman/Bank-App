import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filterAccount, setFilterAccount] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transactionsData, accountsData] = await Promise.all([
        api.getTransactions(),
        api.getAccounts(),
      ]);

      if (transactionsData.transactions) {
        setTransactions(transactionsData.transactions);
      }
      if (accountsData.accounts) {
        setAccounts(accountsData.accounts);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredTransactions = transactions.filter((tx) => {
    if (
      filterAccount !== "all" &&
      tx.account_number !== parseInt(filterAccount)
    ) {
      return false;
    }
    if (
      filterCategory &&
      tx.category.toLowerCase() !== filterCategory.toLowerCase()
    ) {
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

  // Get unique categories for filter
  const categories = [...new Set(transactions.map((tx) => tx.category))];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>Loading history...</div>
    );
  }

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
              {accounts.map((acc) => (
                <option key={acc.account_number} value={acc.account_number}>
                  {acc.label}
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
              {categories.map((cat) => (
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
                  <th>Account</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleString()}</td>
                    <td>{formatTransactionType(tx.type)}</td>
                    <td>{getAccountLabel(tx.account_number)}</td>
                    <td>
                      <span className="badge">{tx.category}</span>
                    </td>
                    <td style={{ color: getAmountColor(tx.type) }}>
                      {getAmountPrefix(tx.type)}$
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
