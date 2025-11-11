import { useState } from "react";
import TransactionModal from "./TransactionModal";

export default function AccountCard({ account, onUpdate }) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const displayName = account.label || "Account";

  return (
    <div className="card">
      <h2>{displayName}</h2>
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
