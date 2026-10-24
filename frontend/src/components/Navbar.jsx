import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/home" className="navbar-brand">
          <div className="brand-icon">
            C
          </div>

          <div className="brand-text">
            <span className="brand-name">
              Campus Canteen
            </span>

            <span className="brand-subtitle">
              Smart food ordering
            </span>
          </div>
        </Link>

        <nav className="navbar-links">
          <Link to="/home">
            Home
          </Link>

          <Link to="/menu">
            Menu
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/orders">
            My Orders
          </Link>
        </nav>

        <Link
          to="/"
          className="navbar-logout"
        >
          Logout
        </Link>

      </div>
    </header>
  );
}

export default Navbar;