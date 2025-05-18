import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const swalWithCrossfade = Swal.mixin({
  showClass: {
    popup: 'animate__animated animate__fadeIn'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut'
  }
});

const applySwalStyling = () => {
  setTimeout(() => {
    const confirmButton = document.querySelector('.swal2-confirm');
    if (confirmButton) {
      confirmButton.style.backgroundColor = '#89bd2e';
      confirmButton.style.color = 'white';
      confirmButton.style.borderRadius = '15px';
      confirmButton.style.fontFamily = 'Montserrat';
      confirmButton.style.boxShadow = 'none';
      confirmButton.style.padding = '10px 24px';
      confirmButton.style.outline = 'none';
    }

    const cancelButton = document.querySelector('.swal2-cancel');
    if (cancelButton) {
      cancelButton.style.backgroundColor = '#dd2e44';
      cancelButton.style.color = 'white';
      cancelButton.style.borderRadius = '15px';
      cancelButton.style.fontFamily = 'Montserrat';
      cancelButton.style.boxShadow = 'none';
      cancelButton.style.padding = '10px 24px';
      cancelButton.style.outline = 'none';
    }

    const swalContainer = document.querySelector('.swal2-popup');
    if (swalContainer) {
      swalContainer.style.width = '600px';
      swalContainer.style.borderRadius = '20px';
      swalContainer.style.backgroundColor = '#f8f9fa';
    }

    const swalTitle = document.querySelector('.swal2-title');
    if (swalTitle) {
      swalTitle.style.color = '#2c3e50';
      swalTitle.style.fontFamily = 'Montserrat';
      swalTitle.style.fontSize = '24px';
      swalTitle.style.fontWeight = 'bold';
    }

    const swalContent = document.querySelector('.swal2-html-container');
    if (swalContent) {
      swalContent.style.color = '#34495e';
      swalContent.style.fontFamily = 'Montserrat';
      swalContent.style.fontSize = '18px';
    }
  }, 10);
};

export default function NavBar({ handleLogout, onSearch }) {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId")
  const [searchTerm, setSearchTerm] = useState("");
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
          console.log("Fetched userType:", data.userType);
        }
      }
    }
    fetchUserTypeAndName();
  }, [userId]);

  const onLogoutClick = async (e) => {
    e.preventDefault();
    
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Logout",
      html: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: () => {
        applySwalStyling();
      }
    });

    if (!isConfirmed) return;
    
    if (handleLogout) handleLogout();

    sessionStorage.removeItem("userId");
    localStorage.removeItem("userId");

    await swalWithCrossfade.fire({
      title: "Logout Successful!",
      text: "You have been logged out successfully.",
      confirmButtonText: "OK",
      didOpen: () => {
        applySwalStyling();
        const confirmButton = document.querySelector('.swal2-confirm');
        if (confirmButton) {
          confirmButton.style.backgroundColor = '#3b86b6';
        }
      },
      willClose: () => {
        window.history.pushState(null, "", window.location.pathname);
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/");

        window.onpopstate = () => {
          if (!sessionStorage.getItem("userId") && !localStorage.getItem("userId")) {
            window.location.href = "/"; 
          }
        };
      }
    });
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
        <Link to="/dashboard" className="logo-link" viewTransition>
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
            <Link to={`/profile?userId=${userName}`} viewTransition>
              <img
                src="assets/user_default_pfp.png"
                alt="Profile"
                className="user-pfp-navbar"
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