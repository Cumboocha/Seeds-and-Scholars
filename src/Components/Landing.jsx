import { useEffect } from "react";
import { Link } from "react-router-dom";
import "animate.css";

export default function Landing({ onLoginBtnClick, onSignupBtnClick }) {
  useEffect(() => {
    if (!sessionStorage.getItem("landingReloaded")) {
      sessionStorage.setItem("landingReloaded", "true");
      window.location.replace(window.location.pathname);
    }
  }, []);

  return (
    <div className="landing-body">
      <div className="landing-side animate__animated animate__slideInLeft">
        <img src="assets/landing_logo_icon_mini.png" className="side-logo" />
        <Link to="/devs" className="logo-link" viewTransition>
          <img src="assets/devs_btn.png" className="devs-btn" />
        </Link>
      </div>
      <div className="landing-elements">
        <img
          src="assets/landing_logo.png"
          class="animate__animated animate__zoomIn"
        />
        <div className="landing-buttons">
          <button
            className="login-btn animate__animated animate__fadeIn animate__delay-1s"
            onClick={onLoginBtnClick}
          >
            &nbsp;LOG IN
          </button>
          <button
            className="signup-btn animate__animated animate__fadeIn animate__delay-1s"
            onClick={onSignupBtnClick}
          >
            &nbsp;SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
