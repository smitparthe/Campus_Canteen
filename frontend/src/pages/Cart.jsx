import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);
  }, []);

  function updateQuantity(id, change) {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + change
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  }

  function removeItem(id) {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  async function placeOrder() {
    setMessage("");
    setError("");

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      navigate("/");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await fetch(
        "https://campus-canteen-1-kr4y.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.id,
            items: cart
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.removeItem("cart");
      setCart([]);

      setMessage(
        `Order #${data.orderId} placed successfully!`
      );
    } catch (error) {
      setError("Could not connect to the backend.");
    } finally {
      setPlacingOrder(false);
    }
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-container">

        {/* Header */}
        <section className="cart-header">
          <div>
            <p className="cart-eyebrow">
              CAMPUS CANTEEN
            </p>

            <h1>Your Cart</h1>

            <p>
              Review your items before placing your order.
            </p>
          </div>

          {cart.length > 0 && (
            <Link
              to="/menu"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>
          )}
        </section>

        {/* Success Message */}
        {message && (
          <div className="cart-success">
            <div className="message-icon">✓</div>

            <div>
              <strong>Order placed successfully!</strong>
              <p>{message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="cart-error">
            <div className="message-icon">!</div>

            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Empty Cart */}
        {cart.length === 0 && !message && (
          <section className="empty-cart">
            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/menu"
              className="browse-menu-button"
            >
              Browse Menu
            </Link>
          </section>
        )}

        {/* Cart */}
        {cart.length > 0 && (
          <div className="cart-layout">

            {/* Items */}
            <section className="cart-items-section">
              <div className="cart-section-header">
                <div>
                  <span>YOUR ORDER</span>
                  <h2>
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "item"
                      : "items"}
                  </h2>
                </div>

                <button
                  className="clear-cart-button"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              <div className="cart-items">
                {cart.map((item) => (
                  <article
                    className="cart-item"
                    key={item.id}
                  >
                    <div className="cart-item-icon">
                      🍽️
                    </div>

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>

                      <p>
                        ₹{item.price} each
                      </p>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <strong className="item-total">
                        ₹
                        {Number(item.price) *
                          item.quantity}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Summary */}
            <aside className="order-summary">
              <div className="summary-label">
                ORDER SUMMARY
              </div>

              <h2>Order Total</h2>

              <div className="summary-row">
                <span>Items</span>

                <span>
                  {cart.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>

                <span>₹{total}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>

                <strong>₹{total}</strong>
              </div>

              <button
                className="place-order-button"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              <p className="summary-note">
                Your order will be sent directly to
                the campus canteen.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;