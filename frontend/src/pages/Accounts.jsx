import { useState } from "react";
import TransactionModal from "../components/TransactionModal";
import { api } from "../utils/api";
import AccountCard from "../components/AccountCard";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await api.getAccounts();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      setError("Failed to load accounts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading accounts...
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
        <h1 className="section-title">Manage Accounts</h1>
      </div>

      {accounts.map((account) => (
        <div className="col-4" key={account.account_number}>
          <AccountCard account={account} onUpdate={loadAccounts} />
        </div>
      ))}

      <div className="col-12">
        <div className="card">
          <h2>Account Information</h2>
          <p style={{ color: "var(--muted)" }}>
            You have three accounts: Checking (1), Savings (2), and Other (3).
            Use these account numbers when making transfers.
          </p>
        </div>
      </div>
    </div>
  );
}
