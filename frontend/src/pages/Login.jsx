import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // TODO: Connect to backend API
    if (username && password) {
      const userData = {
        userId: "123",
        username: username,
        accounts: [
          { id: 1, name: "Checking", balance: 1245.67 },
          { id: 2, name: "Savings", balance: 3420.0 },
          { id: 3, name: "Other", balance: 250.0, customName: "" },
        ],
        categories: ["Food", "Bills", "Entertainment", "Savings", "Paycheck"],
        transactions: [],
      };
      login(userData);
      navigate("/");
    } else {
      setError("Please enter username and password");
    }
  };

  return (
    <div className="grid">
      <div className="col-6">
        <div className="card">
          <h2>Login</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Enter your credentials
          </p>
          {error && (
            <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>
          )}
          <div style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn" onClick={handleSubmit}>
              Sign In
            </button>
          </div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            No account?{" "}
            <NavLink to="/register" style={{ color: "var(--accent)" }}>
              Create one
            </NavLink>
          </p>
        </div>
      </div>
      <div className="col-6">
        <div className="card">
          <h2>Demo Mode</h2>
          <p>
            Enter any username and password to login (backend not connected
            yet).
          </p>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            When backend is connected, this will verify credentials with
            password hashing.
          </p>
        </div>
      </div>
    </div>
  );
}
