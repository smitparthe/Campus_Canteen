import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "https://campus-canteen-1-kr4y.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/home");

    } catch (error) {
      setError("Could not connect to the backend.");
    }
  }

  return (
    <div className="auth-page">

      {/* LEFT BRAND SECTION */}
      <section className="auth-brand">
        <div className="auth-brand-content">

          <div className="brand-mark">
            C
          </div>

          <p className="auth-eyebrow">
            CAMPUS CANTEEN
          </p>

          <h1>
            Good food.
            <br />
            Less waiting.
          </h1>

          <p className="auth-description">
            Order your favorite campus food ahead of time
            and pick it up when it's ready.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>⚡</span>

              <div>
                <strong>Quick ordering</strong>
                <p>Skip the queue and order ahead.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Live order status</strong>
                <p>Know when your food is ready.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span>🍴</span>

              <div>
                <strong>Campus food</strong>
                <p>Everything you need in one place.</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* RIGHT LOGIN SECTION */}
      <section className="auth-form-section">

        <div className="auth-form-card">

          <div className="auth-form-header">

            <p className="auth-small-title">
              WELCOME BACK
            </p>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your details to continue to Campus Canteen.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
            >
              Login
            </button>

          </form>


          <div className="auth-divider">
            <span>or</span>
          </div>


          <p className="auth-register">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>


          <p className="auth-footer">
            Student login for Campus Canteen
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;