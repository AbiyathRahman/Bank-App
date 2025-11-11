import { useAuth } from "../contexts/AuthContext";
import AccountCard from "../components/AccountCard";
import RecentTransactions from "../components/RecentTransactions";
import CategoryChart from "../components/CategoryChart";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Dashboard</h1>
        <p style={{ color: "var(--muted)", marginTop: -8 }}>
          Welcome back, {user.username}!
        </p>
      </div>

      {user.accounts.map((account) => (
        <div className="col-4" key={account.id}>
          <AccountCard account={account} />
        </div>
      ))}

      <div className="col-8">
        <RecentTransactions />
      </div>

      <div className="col-4">
        <CategoryChart />
      </div>
    </div>
  );
}
