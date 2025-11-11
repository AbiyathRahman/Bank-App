import { useState, useEffect } from "react";
import { api } from "../utils/api";
import AccountCard from "../components/AccountCard";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await api.getAccounts();
      if (data.accounts) {
        setAccounts(data.accounts);
        // Set the current name of account 3 as default
        const account3 = data.accounts.find((acc) => acc.account_number === 3);
        if (account3) {
          setNewAccountName(account3.label);
        }
      }
    } catch (error) {
      setError("Failed to load accounts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccountName = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    if (!newAccountName.trim()) {
      setUpdateError("Account name cannot be empty");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch("http://localhost:4000/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accName: newAccountName.trim() }),
      });

      const data = await response.json();

      if (data.message === "Account name updated") {
        setUpdateSuccess("Account name updated successfully!");
        setEditMode(false);
        loadAccounts(); // Reload accounts to show updated name
        setTimeout(() => setUpdateSuccess(""), 3000);
      } else {
        setUpdateError(data.message || "Failed to update account name");
      }
    } catch (error) {
      setUpdateError("Unable to update account name");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    const account3 = accounts.find((acc) => acc.account_number === 3);
    if (account3) {
      setNewAccountName(account3.label);
    }
    setEditMode(false);
    setUpdateError("");
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
          <h2>Customize Account 3 Name</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            You can rename your third account to better organize your finances.
          </p>

          {updateError && (
            <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{updateError}</p>
          )}
          {updateSuccess && (
            <p style={{ color: "#51cf66", marginBottom: 12 }}>
              {updateSuccess}
            </p>
          )}

          {!editMode ? (
            <div>
              <p style={{ marginBottom: 12 }}>
                Current name:{" "}
                <strong>
                  {accounts.find((acc) => acc.account_number === 3)?.label ||
                    "Other"}
                </strong>
              </p>
              <button className="btn" onClick={() => setEditMode(true)}>
                Edit Account Name
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateAccountName}>
              <div style={{ display: "grid", gap: 12 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter new account name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  disabled={updating}
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="submit" className="btn" disabled={updating}>
                    {updating ? "Updating..." : "Save Name"}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={handleCancelEdit}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h2>Account Information</h2>
          <p style={{ color: "var(--muted)" }}>
            You have three accounts: Checking (1), Savings (2), and{" "}
            {accounts.find((acc) => acc.account_number === 3)?.label || "Other"}{" "}
            (3). Use these account numbers when making transfers.
          </p>
        </div>
      </div>
    </div>
  );
}
