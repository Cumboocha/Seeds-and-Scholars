import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="navbar-logo" src="assets/navbar_logo.png" />
      </div>

      <div className="search-container">
        <input
          className="search-bar"
          placeholder="Looking for a specific restaurant?"
        />
        <img src="assets/search_symbol.png" />
      </div>

      <div className="button-container">
        <div>
          {location.pathname === "/profile" ? (
            <Link to="/dashboard">
              <img src="assets/home_symbol.png" />
            </Link>
          ) : location.pathname === "/dashboard" ? (
            <Link to="/profile">
              <img src="assets/profile_symbol.png" />
            </Link>
          ): null}
        </div>
        <div>
          <Link to="/">
            <img src="assets/logout_symbol.png" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
