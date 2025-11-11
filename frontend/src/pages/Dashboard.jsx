import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import AccountCard from "../components/AccountCard";
import RecentTransactions from "../components/RecentTransactions";
import CategoryChart from "../components/CategoryChart";
import { api } from "../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        api.getAccounts(),
        api.getTransactions(),
      ]);

      if (accountsData.accounts) {
        setAccounts(accountsData.accounts);
      }
      if (transactionsData.transactions) {
        setTransactions(transactionsData.transactions);
      }
    } catch (error) {
      setError("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#ff6b6b" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Dashboard</h1>
        <p style={{ color: "var(--muted)", marginTop: -8 }}>Welcome back!</p>
      </div>

      {accounts.map((account) => (
        <div className="col-4" key={account.account_number}>
          <AccountCard account={account} onUpdate={loadData} />
        </div>
      ))}

      <div className="col-8">
        <RecentTransactions transactions={transactions} accounts={accounts} />
      </div>

      <div className="col-4">
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
}
