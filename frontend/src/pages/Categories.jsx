import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CategoryUsageStats from "../components/CategoryUsageStats";

export default function Categories() {
  const { user, login } = useAuth();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddCategory = () => {
    setError("");
    setSuccess("");

    if (!newCategory.trim()) {
      setError("Please enter a category name");
      return;
    }

    if (user.categories.includes(newCategory.trim())) {
      setError("Category already exists");
      return;
    }

    const updatedUser = { ...user };
    updatedUser.categories.push(newCategory.trim());
    login(updatedUser);
    setSuccess("Category added successfully!");
    setNewCategory("");

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (!window.confirm(`Delete category "${categoryToDelete}"?`)) return;

    const updatedUser = { ...user };
    updatedUser.categories = updatedUser.categories.filter(
      (c) => c !== categoryToDelete
    );
    login(updatedUser);
  };

  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="section-title">Manage Categories</h1>
      </div>

      <div className="col-6">
        <div className="card">
          <h2>Create New Category</h2>
          {error && (
            <p style={{ color: "#ff6b6b", marginBottom: 12 }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#51cf66", marginBottom: 12 }}>{success}</p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="e.g., Food, Bills, Entertainment"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button className="btn" onClick={handleAddCategory}>
              Add
            </button>
          </div>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            Categories appear instantly in all deposit/withdrawal/transfer
            forms.
          </p>
        </div>
      </div>

      <div className="col-6">
        <div className="card">
          <h2>My Categories ({user.categories.length})</h2>
          {user.categories.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>
              No categories yet. Create one!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              {user.categories.map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <h2>Category Usage Statistics</h2>
          <CategoryUsageStats />
        </div>
      </div>
    </div>
  );
}
