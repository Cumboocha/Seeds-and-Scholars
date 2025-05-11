import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Login({ onLoginClose, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError("User does not exist.");
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
        setError("Incorrect password.");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, form.email, form.password);
      sessionStorage.setItem("userId", userId);
      console.log("Logged in user ID:", userId);
      alert("Login successful!");
      if (onLoginSuccess) onLoginSuccess(userId);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-body">
      {/* Left Side */}
      <div className="login-container">
        <img src="assets/login_bg.png" />
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
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "LOG IN"}
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div className="login-logo-container">
        <a href="#" onClick={onLoginClose}>
          <img className="login-x-btn" src="assets/login_x_btn.png" />
        </a>
        <img src="assets/login_logo.png" />
      </div>
    </div>
  );
}