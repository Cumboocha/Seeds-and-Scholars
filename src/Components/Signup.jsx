import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
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

export default function Signup({ onSignupClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError(<p className="error-form">Passwords do not match.</p>);
      return;
    }
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "DATA PRIVACY AGREEMENT",
      html: "The personal information gathered after registration will be processed with the utmost confidentiality in accordance with the Data Privacy Act of 2012. The personal data of the participants will be collected, recorded and used according to their privacy policy.<br><br>I give my consent to the site's management to use my data as intended by the privacy policy.",
      showCancelButton: true,
      confirmButtonText: "Agree & Sign Up",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: () => {
        applySwalStyling();
      }
    });

    if (!isConfirmed) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password, 
        createdAt: new Date(),
        userType: "SXduDAM4N2f9FN3bS3vZ",
      });
      
      await swalWithCrossfade.fire({
        title: "Successfully registered!",
        html: `Welcome, ${form.firstName} ${form.lastName}! Please proceed to the login page.`,
        confirmButtonText: "Continue",
        didOpen: () => {
          applySwalStyling();
          const confirmButton = document.querySelector('.swal2-confirm');
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#3b86b6';
          }
        },
        willClose: () => {
          onSignupClose();
        }
      });
      
    } catch (err) {
      setError(err.message);
      swalWithCrossfade.fire({
        title: "Registration Error!",
        text: err.message,
        confirmButtonText: "Try Again",
        didOpen: () => {
          applySwalStyling();
        }
      });
    }
    setLoading(false);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Cancel Registration?",
      html: "Are you sure you want to cancel? Any unsaved changes will be lost.",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Continue Editing",
      width: 600,
      didOpen: () => {
        applySwalStyling();
        setTimeout(() => {
          const confirmButton = document.querySelector('.swal2-confirm');
          if (confirmButton) {
            confirmButton.style.backgroundColor = '#dd2e44';
            confirmButton.style.color = 'white';
            confirmButton.style.borderRadius = '15px';
            confirmButton.style.fontFamily = 'Montserrat';
            confirmButton.style.boxShadow = 'none';
            confirmButton.style.padding = '10px 24px';
            confirmButton.style.outline = 'none';
          }
          const cancelButton = document.querySelector('.swal2-cancel');
          if (cancelButton) {
            cancelButton.style.backgroundColor = '#89bd2e';
            cancelButton.style.color = 'white';
            cancelButton.style.borderRadius = '15px';
            cancelButton.style.fontFamily = 'Montserrat';
            cancelButton.style.boxShadow = 'none';
            cancelButton.style.padding = '10px 24px';
            cancelButton.style.outline = 'none';
          }
        }, 20);
      },
    });
    if (isConfirmed) {
      await swalWithCrossfade.fire({
        title: "Cancelled",
        text: "Registration was cancelled.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
      if (onSignupClose) onSignupClose();
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-logo-container">
        <a href="#" onClick={handleCancel}>
          <img className="signup-x-btn" src="assets/signup_x_btn.png" />
        </a>
        <img src="assets/signup_logo.png" />
      </div>

      <div className="signup-container">
        <img src="assets/signup_bg.png" />
        <form onSubmit={handleSubmit}>
          <div className="first-last-name-row">
            <input
              name="firstName"
              placeholder="First Name*"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name*"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
              type={showPassword ? "text" : "password"}
            placeholder="Password*"
            value={form.password}
            onChange={handleChange}
            required
          />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      style={{
        position: "absolute",
        right: 8,
        top: "48.5%",
        transform: "translateY(-50%)",
        fontSize: "0.8em",
        padding: "2px 8px",
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#333",
        outline: "none"
      }}
      tabIndex={-1}
    >
      {showPassword ? <img className="pass-show-hide" src="assets/password_shown.png"/> : <img className="pass-show-hide" src="assets/password_hidden.png"/>}
    </button>
          <input
            name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password*"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
    <button
      type="button"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      style={{
        position: "absolute",
        right: 8,
        top: "69.5%",
        transform: "translateY(-50%)",
        fontSize: "0.8em",
        padding: "2px 8px",
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#333",
        outline: "none"
      }}
      tabIndex={-1}
    >
      {showConfirmPassword ? <img className="pass-show-hide" src="assets/password_shown.png"/> : <img className="pass-show-hide" src="assets/password_hidden.png"/>}
    </button>
          {error &&             <div style={{ color: "#dd2e44", margin: "10px 0", fontWeight: "bold", fontFamily: "Montserrat" }}>
{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
}