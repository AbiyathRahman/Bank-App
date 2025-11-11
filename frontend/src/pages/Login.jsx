import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login({ username, password });

      if (data.message === "Login successful") {
        login();
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
            />
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
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
          <h2>Secure Login</h2>
          <p>Your credentials are protected with password hashing and salt.</p>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            All connections are secured through session management.
          </p>
        </div>
      </div>
    </div>
  );
}
