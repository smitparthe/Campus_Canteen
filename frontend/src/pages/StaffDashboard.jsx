import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./StaffDashboard.css";

function StaffDashboard() {
  return (
    <div className="staff-page">
      <Navbar />

      <main className="staff-container">

        {/* Header */}
        <section className="staff-header">
          <div>
            <p className="staff-eyebrow">
              CAMPUS CANTEEN
            </p>

            <h1>Staff Dashboard</h1>

            <p>
              Manage today's orders and keep the canteen
              running smoothly.
            </p>
          </div>

          <div className="staff-header-icon">
            🧑‍🍳
          </div>
        </section>

        {/* Navigation */}
        <nav className="staff-navigation">

          <Link
            to="/staff"
            className="staff-nav-item active"
          >
            <span className="staff-nav-icon">
              📊
            </span>

            <span>
              <strong>Dashboard</strong>
              <small>Overview</small>
            </span>
          </Link>

          <Link
            to="/staff/food"
            className="staff-nav-item"
          >
            <span className="staff-nav-icon">
              🍔
            </span>

            <span>
              <strong>Manage Food</strong>
              <small>Menu items</small>
            </span>
          </Link>

          <Link
            to="/staff/orders"
            className="staff-nav-item"
          >
            <span className="staff-nav-icon">
              📋
            </span>

            <span>
              <strong>Manage Orders</strong>
              <small>Customer orders</small>
            </span>
          </Link>

          <Link
            to="/"
            className="staff-nav-item logout"
          >
            <span className="staff-nav-icon">
              ↪
            </span>

            <span>
              <strong>Logout</strong>
              <small>Exit dashboard</small>
            </span>
          </Link>

        </nav>

        {/* Statistics */}
        <section className="staff-stats">

          <div className="staff-stat-card">
            <div className="staff-stat-icon orange">
              📦
            </div>

            <div>
              <span>Today's Orders</span>
              <strong>1</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <div className="staff-stat-icon blue">
              ⏳
            </div>

            <div>
              <span>Pending Orders</span>
              <strong>1</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <div className="staff-stat-icon green">
              ✓
            </div>

            <div>
              <span>Ready Orders</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <div className="staff-stat-icon purple">
              ₹
            </div>

            <div>
              <span>Today's Sales</span>
              <strong>₹90</strong>
            </div>
          </div>

        </section>

        {/* Today's Orders */}
        <section className="staff-orders-section">

          <div className="staff-section-header">
            <div>
              <span className="staff-section-label">
                ORDER MANAGEMENT
              </span>

              <h2>Today's Orders</h2>
            </div>

            <Link
              to="/staff/orders"
              className="view-orders-link"
            >
              View All →
            </Link>
          </div>

          {/* Order Card */}
          <div className="staff-order-card">

            <div className="staff-order-top">

              <div>
                <span className="order-small-label">
                  ORDER
                </span>

                <h3>#101</h3>

                <p>
                  Just now
                </p>
              </div>

              <span className="staff-status pending">
                Pending
              </span>

            </div>

            <div className="staff-order-items">

              <div className="staff-food-row">

                <div className="staff-food-icon">
                  🥟
                </div>

                <div className="staff-food-info">
                  <strong>Samosa</strong>

                  <span>
                    Quantity: 2
                  </span>
                </div>

                <strong>
                  ₹40
                </strong>

              </div>

              <div className="staff-food-row">

                <div className="staff-food-icon">
                  🥪
                </div>

                <div className="staff-food-info">
                  <strong>Sandwich</strong>

                  <span>
                    Quantity: 1
                  </span>
                </div>

                <strong>
                  ₹50
                </strong>

              </div>

            </div>

            <div className="staff-order-bottom">

              <div>
                <span>Total Amount</span>

                <strong>
                  ₹90
                </strong>
              </div>

              <div className="staff-order-actions">

                <button className="prepare-button">
                  Mark Preparing
                </button>

                <button className="ready-button">
                  Mark Ready
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default StaffDashboard;