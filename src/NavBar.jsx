import { Link } from "react-router-dom";

export default function NavBar() {
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
          {" "}
          {/*Admin Button: Pls hide if not admin*/}
          {window.location.pathname === "/admin" ? (
            <Link to="/dashboard" viewTransition>
              <img src="assets/home_symbol.png" />
            </Link>
          ) : (
            <Link to="/admin" viewTransition>
              <img src="assets/admin_symbol.png" />
            </Link>
          )}
        </div>

        <div>
          {" "}
          {/*Profile Button: switches to home button when in profile*/}
          {window.location.pathname === "/profile" ? (
            <Link to="/dashboard" viewTransition>
              <img src="assets/home_symbol.png" />
            </Link>
          ) : window.location.pathname === "/dashboard" ||
            window.location.pathname === "/admin" ? (
            <Link to="/profile" viewTransition>
              <img src="assets/profile_symbol.png" />
            </Link>
          ) : null}
        </div>

        <div>
          {" "}
          {/*Logout Button*/}
          <Link to="/" viewTransition>
            <img src="assets/logout_symbol.png" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
