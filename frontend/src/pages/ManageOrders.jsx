import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://campus-canteen-1-kr4y.onrender.com/api/staff/orders"
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load orders");
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const response = await fetch(
        `http://campus-canteen-1-kr4y.onrender.com/api/staff/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      await fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Could not connect to the backend.");
    }
  }

  function groupOrders() {
    const grouped = {};

    orders.forEach((item) => {
      if (!grouped[item.order_id]) {
        grouped[item.order_id] = {
          order_id: item.order_id,
          user_id: item.user_id,
          customer_name: item.customer_name,
          customer_email: item.customer_email,
          total_amount: item.total_amount,
          status: item.status,
          created_at: item.created_at,
          items: []
        };
      }

      grouped[item.order_id].items.push({
        food_name: item.food_name,
        quantity: item.quantity,
        price: item.price
      });
    });

    return Object.values(grouped);
  }

  const groupedOrders = groupOrders();

  const filteredOrders =
    filter === "All"
      ? groupedOrders
      : groupedOrders.filter(
          (order) => order.status === filter
        );

  return (
    <div className="manage-orders-page">
      <Navbar />

      <div className="manage-orders-container">

        {/* PAGE HEADER */}

        <div className="manage-orders-header">
          <h1>Manage Orders</h1>

          <p>
            View and manage all campus canteen orders.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="orders-loading">
            <p>Loading orders...</p>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* FILTERS */}

        {!loading && !error && (
          <div className="order-filters">

            <div className="order-filters-header">
              <div>
                <h2>Orders</h2>

                <p>
                  Showing: <strong>{filter}</strong>
                </p>
              </div>

              <div className="filter-buttons">

                <button
                  className={
                    filter === "All"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("All")}
                >
                  All
                </button>

                <button
                  className={
                    filter === "Pending"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("Pending")}
                >
                  Pending
                </button>

                <button
                  className={
                    filter === "Preparing"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("Preparing")}
                >
                  Preparing
                </button>

                <button
                  className={
                    filter === "Ready"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("Ready")}
                >
                  Ready
                </button>

                <button
                  className={
                    filter === "Completed"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("Completed")}
                >
                  Completed
                </button>

                <button
                  className={
                    filter === "Cancelled"
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setFilter("Cancelled")}
                >
                  Cancelled
                </button>

              </div>
            </div>

          </div>
        )}

        {/* EMPTY STATE */}

        {!loading &&
          !error &&
          filteredOrders.length === 0 && (
            <div className="orders-empty">
              <h2>No orders found</h2>

              <p>
                There are no orders for the selected filter.
              </p>
            </div>
          )}

        {/* ORDERS */}

        {!loading &&
          !error &&
          filteredOrders.length > 0 && (

            <div className="orders-grid">

              {filteredOrders.map((order) => (

                <div
                  className="order-card"
                  key={order.order_id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>
                      <h2>
                        Order #{order.order_id}
                      </h2>

                      <p className="order-date">
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  {/* CUSTOMER */}

                  <div className="customer-details">

                    <p>
                      <span className="customer-label">
                        Customer
                      </span>
                      <br />

                      <strong>
                        {order.customer_name}
                      </strong>
                    </p>

                    <p>
                      <span className="customer-label">
                        Email
                      </span>
                      <br />

                      {order.customer_email}
                    </p>

                  </div>

                  {/* ITEMS */}

                  <div className="order-items">

                    <h3>Items</h3>

                    {order.items.map((item, index) => (

                      <div
                        className="order-item"
                        key={index}
                      >

                        <span className="order-item-name">
                          {item.food_name}
                        </span>

                        <span className="order-item-quantity">
                          × {item.quantity} — ₹{item.price}
                        </span>

                      </div>

                    ))}

                  </div>

                  {/* TOTAL */}

                  <div className="order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{order.total_amount}
                    </strong>

                  </div>

                  {/* STATUS */}

                  <div className="order-status-row">

                    <div className="current-status">

                      Current Status:{" "}

                      <strong>
                        {order.status}
                      </strong>

                    </div>

                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order.order_id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Preparing">
                        Preparing
                      </option>

                      <option value="Ready">
                        Ready
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>
    </div>
  );
}

export default ManageOrders;