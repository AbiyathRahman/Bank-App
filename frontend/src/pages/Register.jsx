import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await api.register({ username, password, confirmPassword });

      if (data.message === "User created successfully") {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>
      {error && <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>}
      {success && (
        <p style={{ color: "#51cf66", marginBottom: 12 }}>{success}</p>
      )}

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: "rgba(55, 198, 255, 0.1)",
          borderRadius: 8,
          border: "1px solid rgba(55, 198, 255, 0.3)",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--accent)" }}>
          Password Requirements:
        </p>
        <ul
          style={{
            margin: "8px 0 0 0",
            paddingLeft: 20,
            fontSize: "0.85rem",
            color: "var(--muted)",
          }}
        >
          <li>At least 8 characters</li>
          <li>One uppercase letter</li>
          <li>One lowercase letter</li>
          <li>One number</li>
          <li>One special character (@$!%*?#&)</li>
        </ul>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        <div className="col-12">
          <input
            className="input"
            placeholder="Username (unique)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-6">
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-6">
          <input
            className="input"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="col-12">
          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
