import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://campus-canteen-1-kr4y.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
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

      setMessage(data.message);

      setTimeout(() => {
        navigate("/");
      }, 1000);

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
            Create your account and start ordering
            your favorite campus food without the queue.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>⚡</span>

              <div>
                <strong>Quick ordering</strong>
                <p>Order ahead and skip the queue.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span>✓</span>

              <div>
                <strong>Track your orders</strong>
                <p>Know when your food is ready.</p>
              </div>
            </div>

            <div className="auth-feature">
              <span>🍴</span>

              <div>
                <strong>Campus food</strong>
                <p>Your canteen, all in one place.</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* RIGHT REGISTER SECTION */}
      <section className="auth-form-section">

        <div className="auth-form-card">

          <div className="auth-form-header">

            <p className="auth-small-title">
              GET STARTED
            </p>

            <h2>
              Create your account
            </h2>

            <p>
              Join Campus Canteen and start ordering today.
            </p>

          </div>


          <form onSubmit={handleRegister}>

            <div className="form-group">

              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>


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
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {message && (
              <div className="auth-success">
                {message}
              </div>
            )}


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
            >
              Create Account
            </button>

          </form>


          <div className="auth-divider">
            <span>or</span>
          </div>


          <p className="auth-register">
            Already have an account?{" "}
            <Link to="/">
              Login here
            </Link>
          </p>


          <p className="auth-footer">
            Student registration for Campus Canteen
          </p>

        </div>

      </section>

    </div>
  );
}

export default Register;