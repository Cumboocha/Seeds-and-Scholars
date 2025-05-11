import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar({ handleLogout, userId, onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");

  const onLogoutClick = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    if (handleLogout) handleLogout();
    setLogoutMessage("Logout successful!");
    setTimeout(() => setLogoutMessage(""), 2000);
    navigate("/");
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm.trim()); 
      }
    
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="navbar-logo" src="assets/navbar_logo.png" />
      </div>

      <div className="search-container">
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center" }}>
          <input
            className="search-bar"
            placeholder="Looking for a specific restaurant?"
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <img
            src="assets/search_symbol.png"
            alt="Search"
            style={{ cursor: "pointer", marginLeft: "8px" }}
            onClick={handleSearchSubmit}
          />
        </form>
      </div>

      {logoutMessage && (
        <div className="logout-message" style={{ color: "green", marginTop: "10px" }}>
          {logoutMessage}
        </div>
      )}

      <div className="button-container">
        <div>
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
          {/*Profile Button: render UserProfile directly and pass userId*/}
          {/* <UserProfile userId={userId} /> */}
        </div>

        <div>
          {/*Logout Button*/}
          <a href="/" onClick={onLogoutClick}>
            <img src="assets/logout_symbol.png" alt="Logout" />
          </a>
        </div>
      </div>
    </nav>
  );
}
