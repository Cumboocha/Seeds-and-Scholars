import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function NavBar({ handleLogout, onSearch }) {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId")
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState(""); 

  useEffect(() => {
    async function fetchUserTypeAndName() {
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserType(data.userType);
          setUserName(`${data.firstName || ""} ${data.lastName || ""}`.trim());
          console.log("Fetched userType:", data.userType); // <-- Add this
        }
      }
    }
    fetchUserTypeAndName();
  }, [userId]);

  const onLogoutClick = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    if (handleLogout) handleLogout();

    sessionStorage.removeItem("userId");
    localStorage.removeItem("userId");

    setLogoutMessage("Logout successful!");
    setTimeout(() => setLogoutMessage(""), 2000);

    window.history.pushState(null, "", window.location.pathname);
    window.history.replaceState(null, "", window.location.pathname);
    navigate("/");

    window.onpopstate = () => {
      if (!sessionStorage.getItem("userId") && !localStorage.getItem("userId")) {
        window.location.href = "/"; 
      }
    };
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
        <Link to="/dashboard">
          <img className="navbar-logo" src="assets/navbar_logo.png" alt="Logo" />
        </Link>
      </div>

      <div className="search-container">
        <input
          className="search-bar"
          placeholder="Looking for a specific restaurant?"
          value={searchTerm}
          onChange={handleSearchInput}
        />
        <img
          src="assets/search_symbol.png"
          alt="Search"
          className="search-icon"
          onClick={handleSearchSubmit}
        />
      </div>

      {logoutMessage && (
        <div className="logout-message" style={{ color: "green", marginTop: "10px" }}>
          {logoutMessage}
        </div>
      )}

      <div className="button-container">
        {userType && userType.trim() === "WcjOVRmHYXKZHsMzAVY2" && (
          <div>
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
        )}
        <div>
          {window.location.pathname.startsWith("/profile") ? (
            <Link to="/dashboard" viewTransition>
              <img src="assets/home_symbol.png" alt="Home" />
            </Link>
          ) : (
            <Link to={`/profile?userId=${userName}`}>
              <img
                src="assets/user_default_pfp.png"
                alt="Profile"
                className="user-pfp-navbar"
                style={{ marginRight: "8px" }}
              />
              <span style={{ verticalAlign: "middle" }}>
              </span>
            </Link>
          )}
        </div>

        <div>
          <a href="/" onClick={onLogoutClick}>
            <img src="assets/logout_symbol.png" alt="Logout" />
          </a>
        </div>
      </div>
    </nav>
  );
}
