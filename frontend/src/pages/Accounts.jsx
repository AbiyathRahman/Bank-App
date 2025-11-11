import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AccountCard from "../components/AccountCard";

export default function Accounts() {
  const { user, login } = useAuth();
  const [customName, setCustomName] = useState("");

  const handleRename = () => {
    if (!customName.trim()) return;

    const updatedUser = { ...user };
    const otherAccount = updatedUser.accounts.find((a) => a.id === 3);
    if (otherAccount) {
      otherAccount.customName = customName;
    }
    login(updatedUser);
    setCustomName("");
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Manage Accounts</h1>
      </div>

      {user.accounts.map((account) => (
        <div className="col-4" key={account.id}>
          <AccountCard account={account} />
        </div>
      ))}

      <div className="col-6">
        <div className="card">
          <h2>Rename "Other" Account</h2>
          <input
            className="input"
            placeholder="e.g., Travel, Projects, Gifts"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div style={{ marginTop: 10 }}>
            <button className="btn" onClick={handleRename}>
              Save Name
            </button>
          </div>
          <p
            style={{ color: "var(--muted)", marginTop: 8, fontSize: "0.9rem" }}
          >
            Current: {user.accounts[2].customName || "Other"}
          </p>
        </div>
      </div>
    </div>
  );
}
