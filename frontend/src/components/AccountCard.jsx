import { useState } from "react";
import TransactionModal from "./TransactionModal";

export default function AccountCard({ account }) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const displayName =
    account.id === 3 && account.customName ? account.customName : account.name;

  return (
    <div className="card">
      <h2>{displayName}</h2>
      <p>
        Account No: <span className="badge">{account.id}</span>
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
        />
      )}
      {showWithdraw && (
        <TransactionModal
          type="withdraw"
          account={account}
          onClose={() => setShowWithdraw(false)}
        />
      )}
    </div>
  );
}
