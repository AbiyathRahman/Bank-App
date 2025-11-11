import { useState } from "react";
import TransactionModal from "../components/TransactionModal";
import { api } from "../utils/api";

export default function AccountCard({ account, onUpdate }) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(account.label || "");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const displayName = account.label || "Account";
  const canEdit = account.account_number === 3;

  const handleSaveLabel = async () => {
    if (!editLabel.trim()) {
      setEditError("Label cannot be empty");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const data = await api.updateAccountLabel({
        account_number: account.account_number,
        label: editLabel.trim(),
      });

      if (data.message && data.message.includes("updated")) {
        setIsEditing(false);
        onUpdate();
      } else {
        setEditError(data.message || "Failed to update label");
      }
    } catch (error) {
      setEditError("Unable to update label");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditLabel(account.label || "");
    setEditError("");
  };

  return (
    <div className="card">
      {isEditing ? (
        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            placeholder="Account name"
            disabled={editLoading}
            style={{ marginBottom: 8 }}
          />
          {editError && (
            <p
              style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: "4px 0" }}
            >
              {editError}
            </p>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="btn"
              onClick={handleSaveLabel}
              disabled={editLoading}
              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
            >
              {editLoading ? "Saving..." : "Save"}
            </button>
            <button
              className="btn ghost"
              onClick={handleCancelEdit}
              disabled={editLoading}
              style={{ fontSize: "0.85rem", padding: "6px 12px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <h2 style={{ margin: 0, flex: 1 }}>{displayName}</h2>
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      )}
      <p>
        Account No: <span className="badge">{account.account_number}</span>
      </p>
      <p style={{ fontSize: "1.8rem", marginTop: 8 }}>
        ${account.balance.toFixed(2)}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={() => setShowDeposit(true)}>
          Deposit
        </button>
        <button className="btn ghost" onClick={() => setShowWithdraw(true)}>
          Withdraw
        </button>
      </div>

      {showDeposit && (
        <TransactionModal
          type="deposit"
          account={account}
          onClose={() => setShowDeposit(false)}
          onSuccess={onUpdate}
        />
      )}
      {showWithdraw && (
        <TransactionModal
          type="withdraw"
          account={account}
          onClose={() => setShowWithdraw(false)}
          onSuccess={onUpdate}
        />
      )}
    </div>
  );
}
