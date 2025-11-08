export default function Register() {
  return (
    <div className="card">
      <h2>Create Account</h2>
      <div className="grid" style={{ gap: 12 }}>
        <div className="col-6">
          <input className="input" placeholder="Username (unique)" />
        </div>
        <div className="col-6">
          <input className="input" placeholder="Password" type="password" />
        </div>
        <div className="col-6">
          <input
            className="input"
            placeholder="Confirm Password"
            type="password"
          />
        </div>
        <div className="col-6">
          <input className="input" placeholder="Email (optional)" />
        </div>
        <div className="col-12">
          <button className="btn">Register</button>
        </div>
      </div>
    </div>
  );
}
