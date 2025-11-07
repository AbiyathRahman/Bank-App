import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">Banking App</div>
        <div className="nav-links">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/accounts">Accounts</NavLink>
          <NavLink to="/transfer">Transfer</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
      </div>
    </nav>
  );
}
