import { useState } from "react";
import { api } from "../utils/api";

export default function TransactionModal({
  type,
  account,
  onClose,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      const data =
        type === "deposit"
          ? await api.deposit({
              account_number: account.account_number,
              amount: amountNum,
              category: category.trim(),
            })
          : await api.withdraw({
              account_number: account.account_number,
              amount: amountNum,
              category: category.trim(),
            });

      if (data.message && data.message.includes("successful")) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Transaction failed");
      }
    } catch (error) {
      setError("Unable to process transaction");
    } finally {
      setLoading(false);
    }
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
          {type === "deposit" ? "Deposit" : "Withdraw"} - {account.label}
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
            disabled={loading}
          />

          <input
            className="input"
            placeholder="Category (e.g., Food, Bills, Paycheck)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? "Processing..."
                : type === "deposit"
                ? "Deposit"
                : "Withdraw"}
            </button>
            <button className="btn ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}