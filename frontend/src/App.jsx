import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transfer from "./pages/Transfer.jsx";
import History from "./pages/History.jsx";
import Categories from "./pages/Categories.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/history" element={<History />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
      <footer className="footer">© Banking App (layout only)</footer>
    </div>
  );
}
