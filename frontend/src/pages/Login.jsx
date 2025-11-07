export default function Login() {
  return (
    <div className="grid">
      <div className="col-6">
        <div className="card">
          <h2>Login</h2>
          <p className="section-title">Enter your credentials</p>
          <div style={{ display: "grid", gap: 12 }}>
            <input className="input" placeholder="Username" />
            <input className="input" placeholder="Password" type="password" />
            <button className="btn">Sign In</button>
          </div>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            No account?{" "}
            <a href="/register" style={{ color: "var(--accent)" }}>
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
