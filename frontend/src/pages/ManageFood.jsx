import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ManageFood.css";

function ManageFood() {
  const [food, setFood] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFood();
  }, []);

  async function fetchFood() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/food"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load food");
        return;
      }

      setFood(data);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setEditingId(null);
  }

  function startAddFood() {
    clearForm();
    setShowForm(true);
    setMessage("");
    setError("");

    setTimeout(() => {
      document.getElementById("food-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function startEditFood(item) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description || "");
    setCategory(item.category);

    setShowForm(true);
    setMessage("");
    setError("");

    setTimeout(() => {
      document.getElementById("food-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const url = editingId
        ? `http://localhost:5000/api/staff/food/${editingId}`
        : "http://localhost:5000/api/staff/food";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: name,
          price: Number(price),
          description: description,
          category: category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save food");
        return;
      }

      if (editingId) {
        setMessage("Food updated successfully!");
      } else {
        setMessage("Food added successfully!");
      }

      clearForm();
      setShowForm(false);

      await fetchFood();
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteFood(foodId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/food/${foodId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete food");
        return;
      }

      setMessage("Food deleted successfully!");

      await fetchFood();
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    }
  }

  return (
    <div className="manage-food-page">
      <Navbar />

      <main className="manage-food-container">

        {/* Header */}
        <section className="manage-food-header">
          <div>
            <p className="manage-food-eyebrow">
              STAFF PANEL
            </p>

            <h1>Manage Food</h1>

            <p>
              Add, edit and remove items from the
              campus canteen menu.
            </p>
          </div>

          <div className="manage-food-header-icon">
            🍽️
          </div>
        </section>

        {/* Navigation */}
        <nav className="food-navigation">

          <Link
            to="/staff"
            className="food-nav-item"
          >
            <span>📊</span>

            <div>
              <strong>Dashboard</strong>
              <small>Overview</small>
            </div>
          </Link>

          <Link
            to="/staff/food"
            className="food-nav-item active"
          >
            <span>🍔</span>

            <div>
              <strong>Manage Food</strong>
              <small>Menu items</small>
            </div>
          </Link>

          <Link
            to="/staff/orders"
            className="food-nav-item"
          >
            <span>📋</span>

            <div>
              <strong>Manage Orders</strong>
              <small>Customer orders</small>
            </div>
          </Link>

          <Link
            to="/"
            className="food-nav-item logout"
          >
            <span>↪</span>

            <div>
              <strong>Logout</strong>
              <small>Exit dashboard</small>
            </div>
          </Link>

        </nav>

        {/* Messages */}
        {message && (
          <div className="food-message success">
            <span>✓</span>

            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="food-message error">
            <span>!</span>

            <p>{error}</p>
          </div>
        )}

        {/* Add Food Button */}
        {!showForm && (
          <button
            className="add-food-button"
            onClick={startAddFood}
          >
            <span>+</span>
            Add New Food
          </button>
        )}

        {/* Form */}
        {showForm && (
          <section
            id="food-form"
            className="food-form-card"
          >
            <div className="food-form-header">
              <div>
                <span className="form-eyebrow">
                  {editingId
                    ? "UPDATE MENU"
                    : "NEW MENU ITEM"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Food"
                    : "Add New Food"}
                </h2>

                <p>
                  Enter the details for this menu item.
                </p>
              </div>

              <div className="form-icon">
                {editingId ? "✏️" : "🍴"}
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-field">
                  <label>Food Name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="e.g. Samosa"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Price</label>

                  <div className="price-input">
                    <span>₹</span>

                    <input
                      type="number"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="Enter price"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-field full-width">
                  <label>Description</label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Describe the food item..."
                  />
                </div>

                <div className="form-field">
                  <label>Category</label>

                  <input
                    type="text"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    placeholder="e.g. Snacks"
                    required
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-food-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Food"
                      : "Save Food"}
                </button>

                <button
                  type="button"
                  className="cancel-food-button"
                  onClick={() => {
                    clearForm();
                    setShowForm(false);
                    setError("");
                    setMessage("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          </section>
        )}

        {/* Food Section */}
        <section className="available-food-section">

          <div className="available-food-header">
            <div>
              <span>
                MENU MANAGEMENT
              </span>

              <h2>Available Food</h2>
            </div>

            {!loading && (
              <div className="food-count">
                {food.length}{" "}
                {food.length === 1
                  ? "item"
                  : "items"}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="food-loading">
              <div className="food-spinner"></div>

              <h3>Loading menu...</h3>

              <p>
                Fetching food items from the database.
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            food.length === 0 && (
              <div className="food-empty">
                <div className="food-empty-icon">
                  🍽️
                </div>

                <h3>No food available</h3>

                <p>
                  Add your first menu item to get
                  started.
                </p>
              </div>
            )}

          {/* Food Grid */}
          {!loading &&
            food.length > 0 && (
              <div className="food-grid">

                {food.map((item) => (
                  <article
                    className="food-card"
                    key={item.id}
                  >
                    <div className="food-card-top">

                      <div className="food-card-icon">
                        🍴
                      </div>

                      <span className="food-category">
                        {item.category}
                      </span>

                    </div>

                    <div className="food-card-content">

                      <h3>
                        {item.name}
                      </h3>

                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                      <div className="food-card-price">
                        ₹{item.price}
                      </div>

                    </div>

                    <div className="food-card-actions">

                      <button
                        className="edit-food-button"
                        onClick={() =>
                          startEditFood(item)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-food-button"
                        onClick={() =>
                          deleteFood(item.id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>
                  </article>
                ))}

              </div>
            )}

        </section>

      </main>
    </div>
  );
}

export default ManageFood;