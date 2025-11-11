import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function TransactionModal({ type, account, onClose }) {
  const { user, login } = useAuth();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (type === "withdraw" && amountNum > account.balance) {
      setError("Insufficient funds");
      return;
    }

    const finalCategory = showNewCategory ? newCategory : category;
    if (!finalCategory) {
      setError("Please select or create a category");
      return;
    }

    // Update user data
    const updatedUser = { ...user };
    const accountIndex = updatedUser.accounts.findIndex(
      (a) => a.id === account.id
    );

    if (type === "deposit") {
      updatedUser.accounts[accountIndex].balance += amountNum;
    } else {
      updatedUser.accounts[accountIndex].balance -= amountNum;
    }

    // Add category if new
    if (showNewCategory && !updatedUser.categories.includes(newCategory)) {
      updatedUser.categories.push(newCategory);
    }

    // Add transaction
    updatedUser.transactions.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      type: type,
      account: account.name,
      accountId: account.id,
      amount: type === "deposit" ? amountNum : -amountNum,
      category: finalCategory,
    });

    login(updatedUser);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ width: "min(500px, 90%)", maxWidth: 500 }}>
        <h2>
          {type === "deposit" ? "Deposit" : "Withdraw"} - {account.name}
        </h2>
        {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <input
            className="input"
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {!showNewCategory ? (
            <>
              <select
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category...</option>
                {user.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                className="btn ghost"
                onClick={() => setShowNewCategory(true)}
                type="button"
              >
                + Create New Category
              </button>
            </>
          ) : (
            <>
              <input
                className="input"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                className="btn ghost"
                onClick={() => setShowNewCategory(false)}
                type="button"
              >
                ← Back to existing categories
              </button>
            </>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={handleSubmit}>
              {type === "deposit" ? "Deposit" : "Withdraw"}
            </button>
            <button className="btn ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
