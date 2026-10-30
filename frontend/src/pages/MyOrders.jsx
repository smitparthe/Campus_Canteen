import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://campus-canteen-1-kr4y.onrender.com/api/orders/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load orders"
        );
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError(
        "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  function groupOrders() {
    const grouped = {};

    orders.forEach((item) => {
      if (!grouped[item.order_id]) {
        grouped[item.order_id] = {
          order_id: item.order_id,
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

  function getStatusClass(status) {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";

      case "preparing":
        return "status-preparing";

      case "ready":
        return "status-ready";

      case "completed":
        return "status-completed";

      case "cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  }

  const groupedOrders = groupOrders();

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-container">

        {/* Header */}
        <section className="orders-header">
          <div>
            <p className="orders-eyebrow">
              CAMPUS CANTEEN
            </p>

            <h1>My Orders</h1>

            <p>
              Track your orders and see your previous
              purchases.
            </p>
          </div>

          <div className="orders-header-icon">
            📋
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="orders-message">
            <div className="orders-spinner"></div>

            <h2>Loading your orders...</h2>

            <p>
              Please wait while we fetch your order
              history.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="orders-error">
            <div className="orders-message-icon">
              !
            </div>

            <div>
              <strong>
                Unable to load orders
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* No Orders */}
        {!loading &&
          !error &&
          groupedOrders.length === 0 && (
            <div className="orders-message">
              <div className="empty-orders-icon">
                🛍️
              </div>

              <h2>No orders yet</h2>

              <p>
                Once you place an order, it will
                appear here.
              </p>
            </div>
          )}

        {/* Orders */}
        {!loading &&
          !error &&
          groupedOrders.length > 0 && (
            <section className="orders-list">

              <div className="orders-list-header">
                <div>
                  <span>ORDER HISTORY</span>

                  <h2>
                    {groupedOrders.length}{" "}
                    {groupedOrders.length === 1
                      ? "Order"
                      : "Orders"}
                  </h2>
                </div>
              </div>

              {groupedOrders.map((order) => (
                <article
                  className="order-card"
                  key={order.order_id}
                >
                  {/* Order Top */}
                  <div className="order-card-header">
                    <div>
                      <span className="order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order.order_id}
                      </h2>

                      <p>
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="order-items">
                    {order.items.map(
                      (item, index) => (
                        <div
                          className="order-item"
                          key={index}
                        >
                          <div className="order-item-icon">
                            🍽️
                          </div>

                          <div className="order-item-info">
                            <strong>
                              {item.food_name}
                            </strong>

                            <span>
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </span>
                          </div>

                          <strong className="order-item-total">
                            ₹
                            {Number(item.price) *
                              item.quantity}
                          </strong>
                        </div>
                      )
                    )}
                  </div>

                  {/* Order Bottom */}
                  <div className="order-card-footer">
                    <span>Total</span>

                    <strong>
                      ₹{order.total_amount}
                    </strong>
                  </div>
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

export default MyOrders;