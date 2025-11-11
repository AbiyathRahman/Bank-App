import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">Bank App</div>
        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end>
                Dashboard
              </NavLink>
              <NavLink to="/accounts">Accounts</NavLink>
              <NavLink to="/transfer">Transfer</NavLink>
              <NavLink to="/history">History</NavLink>
              <NavLink to="/categories">Categories</NavLink>
              <button
                onClick={handleLogout}
                className="btn ghost"
                style={{ marginLeft: 8 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
