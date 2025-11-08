export default function AccountCard({
  name = "Account",
  balance = "$0.00",
  number = "—",
}) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>
        Account No: <span className="badge">{number}</span>
      </p>
      <p style={{ fontSize: "1.8rem", marginTop: 8 }}>{balance}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn">Deposit</button>
        <button className="btn ghost">Withdraw</button>
      </div>
    </div>
  );
}
