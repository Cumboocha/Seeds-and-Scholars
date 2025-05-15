import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
      setError("Passwords do not match.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to sign up with these details?");
    if (!confirmed) {
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
      alert("Signup successful!");
      onSignupClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="signup-body">
      {/* Left Side */}
      <div className="signup-logo-container">
        <a href="#" onClick={onSignupClose}>
          <img className="signup-x-btn" src="assets/signup_x_btn.png" />
        </a>
        <img src="assets/signup_logo.png" />
      </div>

      {/* Right Side */}
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
        color: "#333"
      }}
      tabIndex={-1}
    >
      {showPassword ? "Hide" : "Show"}
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
        color: "#333"
      }}
      tabIndex={-1}
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
          {error &&             <div style={{ color: "red", margin: "10px 0", fontWeight: "bold" }}>
{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
}