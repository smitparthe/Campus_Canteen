import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function StudentHome() {
  const navigate = useNavigate();

  const [backendMessage, setBackendMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [navigate]);

  async function testBackend() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/test"
      );

      const data = await response.json();

      setBackendMessage(data.message);
    } catch (error) {
      setBackendMessage("Backend connection failed");
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-main">

        {/* Hero Section */}

        <section className="home-hero">

          <div className="hero-content">

            <span className="hero-eyebrow">
              CAMPUS CANTEEN
            </span>

            <h1>
              Good food.
              <br />
              <span>Less waiting.</span>
            </h1>

            <p className="hero-description">
              Welcome back, {user.name}.
              Order your favorite campus food
              and pick it up when it's ready.
            </p>

            <div className="hero-actions">

              <button
                className="primary-button hero-button"
                onClick={() => navigate("/menu")}
              >
                Browse Menu
                <span>→</span>
              </button>

              <button
                className="secondary-button hero-button"
                onClick={() => navigate("/orders")}
              >
                View Orders
              </button>

            </div>

          </div>


          <div className="hero-visual">

            <div className="hero-food-card">

              <div className="hero-food-icon">
                🍽️
              </div>

              <div>
                <span className="hero-card-label">
                  TODAY'S SPECIAL
                </span>

                <h3>
                  Freshly prepared
                </h3>

                <p>
                  Order before the rush.
                </p>
              </div>

            </div>

            <div className="floating-card floating-card-one">
              <span>⚡</span>
              <div>
                <strong>Quick ordering</strong>
                <small>Skip the queue</small>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <span>✓</span>
              <div>
                <strong>Live status</strong>
                <small>Track your order</small>
              </div>
            </div>

          </div>

        </section>


        {/* Quick Actions */}

        <section className="quick-section">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                QUICK ACCESS
              </span>

              <h2>
                What would you like to do?
              </h2>
            </div>

          </div>


          <div className="quick-grid">

            <button
              className="quick-card"
              onClick={() => navigate("/menu")}
            >

              <div className="quick-icon menu-icon">
                🍴
              </div>

              <div className="quick-card-content">
                <h3>Browse Menu</h3>

                <p>
                  Explore today's food and drinks.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-card"
              onClick={() => navigate("/cart")}
            >

              <div className="quick-icon cart-icon">
                🛒
              </div>

              <div className="quick-card-content">
                <h3>My Cart</h3>

                <p>
                  Review your selected items.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-card"
              onClick={() => navigate("/orders")}
            >

              <div className="quick-icon order-icon">
                📦
              </div>

              <div className="quick-card-content">
                <h3>My Orders</h3>

                <p>
                  Track your previous orders.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>

          </div>

        </section>


        {/* Backend Test */}

        <section className="system-section">

          <div>
            <span className="system-dot"></span>

            <div>
              <strong>
                System connection
              </strong>

              <p>
                Check whether the canteen service
                is connected to the backend.
              </p>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={testBackend}
          >
            Test Connection
          </button>

        </section>

        {backendMessage && (
          <div className="backend-message">
            {backendMessage}
          </div>
        )}

      </main>

    </div>
  );
}

export default StudentHome;