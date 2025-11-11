import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Transfer() {
  const { user, login } = useAuth();

  // Internal transfer state
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  // External transfer state
  const [externalFromAccount, setExternalFromAccount] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [targetAccountNum, setTargetAccountNum] = useState("");
  const [externalAmount, setExternalAmount] = useState("");
  const [externalCategory, setExternalCategory] = useState("");
  const [externalNewCategory, setExternalNewCategory] = useState("");
  const [showExternalNewCategory, setShowExternalNewCategory] = useState(false);

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [externalError, setExternalError] = useState("");
  const [externalSuccess, setExternalSuccess] = useState("");

  const handleInternalTransfer = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!fromAccount || !toAccount) {
      setError("Please select both accounts");
      return;
    }

    if (fromAccount === toAccount) {
      setError("Cannot transfer to the same account");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const finalCategory = showNewCategory ? newCategory : category;
    if (!finalCategory) {
      setError("Please select or create a category");
      return;
    }

    const fromAcc = user.accounts.find((a) => a.id === parseInt(fromAccount));
    if (amountNum > fromAcc.balance) {
      setError("Insufficient funds");
      return;
    }

    // Update user data
    const updatedUser = { ...user };
    const fromIndex = updatedUser.accounts.findIndex(
      (a) => a.id === parseInt(fromAccount)
    );
    const toIndex = updatedUser.accounts.findIndex(
      (a) => a.id === parseInt(toAccount)
    );

    updatedUser.accounts[fromIndex].balance -= amountNum;
    updatedUser.accounts[toIndex].balance += amountNum;

    // Add category if new
    if (showNewCategory && !updatedUser.categories.includes(newCategory)) {
      updatedUser.categories.push(newCategory);
    }

    // Add transaction
    updatedUser.transactions.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      type: "transfer",
      account: `${updatedUser.accounts[fromIndex].name} → ${updatedUser.accounts[toIndex].name}`,
      accountId: parseInt(fromAccount),
      amount: -amountNum,
      category: finalCategory,
    });

    login(updatedUser);
    setSuccess("Transfer completed successfully!");

    // Clear form
    setAmount("");
    setCategory("");
    setNewCategory("");
    setShowNewCategory(false);

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleExternalTransfer = (e) => {
    e.preventDefault();
    setExternalError("");
    setExternalSuccess("");

    // Validation
    if (!externalFromAccount || !targetUserId || !targetAccountNum) {
      setExternalError("Please fill in all fields");
      return;
    }

    const amountNum = parseFloat(externalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setExternalError("Please enter a valid amount");
      return;
    }

    const accountNum = parseInt(targetAccountNum);
    if (accountNum < 1 || accountNum > 3) {
      setExternalError("Target account must be 1, 2, or 3");
      return;
    }

    const finalCategory = showExternalNewCategory
      ? externalNewCategory
      : externalCategory;
    if (!finalCategory) {
      setExternalError("Please select or create a category");
      return;
    }

    const fromAcc = user.accounts.find(
      (a) => a.id === parseInt(externalFromAccount)
    );
    if (amountNum > fromAcc.balance) {
      setExternalError("Insufficient funds");
      return;
    }

    // TODO: Connect to backend API for external transfers
    // For now, just show success message
    setExternalSuccess(
      `Transfer of $${amountNum.toFixed(
        2
      )} to User ${targetUserId}, Account ${targetAccountNum} initiated (backend not connected)`
    );

    // Clear form
    setTargetUserId("");
    setTargetAccountNum("");
    setExternalAmount("");
    setExternalCategory("");
    setExternalNewCategory("");
    setShowExternalNewCategory(false);

    setTimeout(() => setExternalSuccess(""), 5000);
  };

  return (
    <div className="card">
      <h1 className="section-title">Transfer Money</h1>

      {/* INTERNAL TRANSFERS */}
      <div style={{ marginBottom: 40 }}>
        <h2>Within My Accounts</h2>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          Transfer money between your own accounts
        </p>

        {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}
        {success && (
          <p style={{ color: "#51cf66", marginBottom: 12 }}>{success}</p>
        )}

        <div className="grid" style={{ gap: 10 }}>
          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              From Account
            </label>
            <select
              className="select"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
            >
              <option value="">Select account...</option>
              {user.accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.id}) - ${acc.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              To Account
            </label>
            <select
              className="select"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
            >
              <option value="">Select account...</option>
              {user.accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.id})
                </option>
              ))}
            </select>
          </div>

          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Amount
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Category
            </label>
            {!showNewCategory ? (
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
            ) : (
              <input
                className="input"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}
          </div>

          <div className="col-6">
            <button
              className="btn ghost"
              onClick={() => setShowNewCategory(!showNewCategory)}
              type="button"
              style={{ width: "100%", marginTop: 22 }}
            >
              {showNewCategory
                ? "← Use Existing Category"
                : "+ Create New Category"}
            </button>
          </div>

          <div className="col-6">
            <button
              className="btn"
              onClick={handleInternalTransfer}
              style={{ width: "100%", marginTop: 22 }}
            >
              Transfer Money
            </button>
          </div>
        </div>
      </div>

      {/* EXTERNAL TRANSFERS */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 32,
          marginTop: 32,
        }}
      >
        <h2>To Another User</h2>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          Transfer money to another user's account (requires User ID and Account
          Number)
        </p>

        {externalError && (
          <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{externalError}</p>
        )}
        {externalSuccess && (
          <p style={{ color: "#51cf66", marginBottom: 12 }}>
            {externalSuccess}
          </p>
        )}

        <div className="grid" style={{ gap: 10 }}>
          <div className="col-4">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              From Account
            </label>
            <select
              className="select"
              value={externalFromAccount}
              onChange={(e) => setExternalFromAccount(e.target.value)}
            >
              <option value="">Select account...</option>
              {user.accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - ${acc.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-4">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Target User ID
            </label>
            <input
              className="input"
              placeholder="e.g., 456"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
            />
          </div>

          <div className="col-4">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Target Account # (1/2/3)
            </label>
            <input
              className="input"
              type="number"
              min="1"
              max="3"
              placeholder="1, 2, or 3"
              value={targetAccountNum}
              onChange={(e) => setTargetAccountNum(e.target.value)}
            />
          </div>

          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Amount
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={externalAmount}
              onChange={(e) => setExternalAmount(e.target.value)}
            />
          </div>

          <div className="col-6">
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Category
            </label>
            {!showExternalNewCategory ? (
              <select
                className="select"
                value={externalCategory}
                onChange={(e) => setExternalCategory(e.target.value)}
              >
                <option value="">Select category...</option>
                {user.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                placeholder="New category name"
                value={externalNewCategory}
                onChange={(e) => setExternalNewCategory(e.target.value)}
              />
            )}
          </div>

          <div className="col-6">
            <button
              className="btn ghost"
              onClick={() =>
                setShowExternalNewCategory(!showExternalNewCategory)
              }
              type="button"
              style={{ width: "100%" }}
            >
              {showExternalNewCategory
                ? "← Use Existing Category"
                : "+ Create New Category"}
            </button>
          </div>

          <div className="col-6">
            <button
              className="btn"
              onClick={handleExternalTransfer}
              style={{ width: "100%" }}
            >
              Send to User
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "rgba(255, 198, 55, 0.1)",
            border: "1px solid rgba(255, 198, 55, 0.3)",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ffc637" }}>
            ⚠️ Note: External transfers require backend API connection to
            complete. This feature will be fully functional once connected to
            your server.
          </p>
        </div>
      </div>
    </div>
  );
}
