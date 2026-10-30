import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./StudentMenu.css";

function StudentMenu() {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFood() {
      try {
        const response = await fetch(
          "http://campus-canteen-1-kr4y.onrender.com/api/food"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load food");
          return;
        }

        setFood(data);
      } catch (error) {
        setError("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchFood();
  }, []);

  function addToCart(item) {
    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingItem = existingCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: 1
        }
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(`${item.name} added to cart!`);
  }

  return (
    <div className="menu-page">
      <Navbar />

      <main className="menu-container">
        <section className="menu-header">
          <div>
            <p className="menu-eyebrow">CAMPUS CANTEEN</p>

            <h1>Today's Menu</h1>

            <p className="menu-subtitle">
              Fresh food, simple ordering, less waiting.
            </p>
          </div>

          <div className="menu-header-badge">
            <span>🍴</span>
            <div>
              <strong>Freshly prepared</strong>
              <small>Order before the rush</small>
            </div>
          </div>
        </section>

        {loading && (
          <div className="menu-message">
            <div className="loading-dot"></div>
            <p>Loading today's food...</p>
          </div>
        )}

        {error && (
          <div className="menu-error">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          food.length === 0 && (
            <div className="menu-message">
              <h2>No food available</h2>
              <p>Check back later for today's menu.</p>
            </div>
          )}

        {!loading &&
          !error &&
          food.length > 0 && (
            <section className="food-grid">
              {food.map((item) => (
                <article
                  className="food-card"
                  key={item.id}
                >
                  <div className="food-card-top">
                    <div className="food-icon">
                      🍽️
                    </div>

                    <span className="food-category">
                      {item.category}
                    </span>
                  </div>

                  <div className="food-card-content">
                    <h2>{item.name}</h2>

                    <p className="food-description">
                      {item.description}
                    </p>
                  </div>

                  <div className="food-card-bottom">
                    <div className="food-price">
                      ₹{item.price}
                    </div>

                    <button
                      className="add-cart-button"
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      <span>+</span>
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

export default StudentMenu;