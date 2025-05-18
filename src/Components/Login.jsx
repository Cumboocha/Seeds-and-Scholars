import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const swalWithCrossfade = Swal.mixin({
  showClass: { popup: 'animate__animated animate__fadeIn' },
  hideClass: { popup: 'animate__animated animate__fadeOut' }
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

export default function Login({ onLoginClose, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", form.email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError(<p className="error-form">User does not exist.</p>);
        setLoading(false);
        return;
      }
      let userDoc = null;
      let userId = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().password === form.password) {
          userDoc = doc.data();
          userId = doc.id;
        }
      });
      if (!userDoc) {
        setError(<p className="error-form">Incorrect password.</p>);
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, form.email, form.password);

      await swalWithCrossfade.fire({
        title: "Login Successful!",
        html: `Welcome back, ${userDoc.firstName} ${userDoc.lastName}!`,
        confirmButtonText: "Continue",
        didOpen: applySwalStyling,
        willClose: () => {
          if (onLoginSuccess) onLoginSuccess(userId);
        }
      });

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <img src="assets/login_bg.png" onLoad={() => {}}/>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
              top: "48%",
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
          {error && <div style={{ color: "red", margin: "10px 0", fontWeight: "bold" }}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "LOG IN"}
          </button>
        </form>
      </div>

      <div className="login-logo-container">
        <a href="#" onClick={onLoginClose}>
          <img className="login-x-btn" src="assets/login_x_btn.png" />
        </a>
        <img src="assets/login_logo.png" />
      </div>
    </div>
  );
}