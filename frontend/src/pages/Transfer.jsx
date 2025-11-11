import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);

  // Internal transfer state
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // External transfer state
  const [externalFromAccount, setExternalFromAccount] = useState("");
  const [receiverPublicID, setReceiverPublicID] = useState("");
  const [targetAccountNum, setTargetAccountNum] = useState("");
  const [externalAmount, setExternalAmount] = useState("");
  const [externalCategory, setExternalCategory] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [externalError, setExternalError] = useState("");
  const [externalSuccess, setExternalSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [externalLoading, setExternalLoading] = useState(false);

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
      console.error("Failed to load accounts", error);
    }
  };

  const handleInternalTransfer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

    if (!category.trim()) {
      setError("Please enter a category");
      return;
    }

    setLoading(true);

    try {
      const data = await api.transferInternal({
        from_account_number: parseInt(fromAccount),
        to_account_number: parseInt(toAccount),
        amount: amountNum,
        category: category.trim(),
      });

      if (data.message && data.message.includes("successful")) {
        setSuccess("Transfer completed successfully!");
        setAmount("");
        setCategory("");
        loadAccounts();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Transfer failed");
      }
    } catch (error) {
      setError("Unable to process transfer");
    } finally {
      setLoading(false);
    }
  };

  const handleExternalTransfer = async (e) => {
    e.preventDefault();
    setExternalError("");
    setExternalSuccess("");

    if (!externalFromAccount || !receiverPublicID || !targetAccountNum) {
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

    if (!externalCategory.trim()) {
      setExternalError("Please enter a category");
      return;
    }

    setExternalLoading(true);

    try {
      const data = await api.transferExternal({
        receiverPublicID: receiverPublicID.trim(),
        from_account_number: parseInt(externalFromAccount),
        to_account_number: accountNum,
        amount: amountNum,
        category: externalCategory.trim(),
      });

      if (data.message && data.message.includes("successful")) {
        setExternalSuccess(
          `Transfer of $${amountNum.toFixed(
            2
          )} to User ${receiverPublicID} completed!`
        );
        setReceiverPublicID("");
        setTargetAccountNum("");
        setExternalAmount("");
        setExternalCategory("");
        loadAccounts();
        setTimeout(() => setExternalSuccess(""), 5000);
      } else {
        setExternalError(data.message || "Transfer failed");
      }
    } catch (error) {
      setExternalError("Unable to process transfer");
    } finally {
      setExternalLoading(false);
    }
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
              disabled={loading}
            >
              <option value="">Select account...</option>
              {accounts.map((acc) => (
                <option key={acc.account_number} value={acc.account_number}>
                  {acc.label} ({acc.account_number}) - ${acc.balance.toFixed(2)}
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
              disabled={loading}
            >
              <option value="">Select account...</option>
              {accounts.map((acc) => (
                <option key={acc.account_number} value={acc.account_number}>
                  {acc.label} ({acc.account_number})
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
              disabled={loading}
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
            <input
              className="input"
              placeholder="e.g., Savings, Bills"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="col-12">
            <button
              className="btn"
              onClick={handleInternalTransfer}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Processing..." : "Transfer Money"}
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
          Transfer money to another user's account using their Public ID
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
              disabled={externalLoading}
            >
              <option value="">Select account...</option>
              {accounts.map((acc) => (
                <option key={acc.account_number} value={acc.account_number}>
                  {acc.label} - ${acc.balance.toFixed(2)}
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
              Receiver Public ID
            </label>
            <input
              className="input"
              placeholder="e.g., ACC1234"
              value={receiverPublicID}
              onChange={(e) => setReceiverPublicID(e.target.value)}
              disabled={externalLoading}
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
              disabled={externalLoading}
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
              disabled={externalLoading}
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
            <input
              className="input"
              placeholder="e.g., Payment, Gift"
              value={externalCategory}
              onChange={(e) => setExternalCategory(e.target.value)}
              disabled={externalLoading}
            />
          </div>

          <div className="col-12">
            <button
              className="btn"
              onClick={handleExternalTransfer}
              disabled={externalLoading}
              style={{ width: "100%" }}
            >
              {externalLoading ? "Processing..." : "Send to User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
