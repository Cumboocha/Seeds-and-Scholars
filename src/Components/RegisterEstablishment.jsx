import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase app and Firestore (ensure this is only called once in your app)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function RegisterEstablishment({ onRegEstablishClose, userId }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    contactNumber: "",
    openingHours: "",
    closingHours: "",
  });

  const [daysClosed, setDaysClosed] = useState([]);

  if (userId) {
    localStorage.setItem("userId", userId);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDaysClosed([...daysClosed, value]);
    } else {
      setDaysClosed(daysClosed.filter(day => day !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "restaurants"), {
        name: form.name,
        description: form.description,
        address: form.address,
        contactNumber: form.contactNumber,
        openingHours: form.openingHours,
        closingHours: form.closingHours,
        daysClosed: daysClosed,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId || "admin",
        updatedBy: userId || "admin",
        latitude: 0,
        longitude: 0,
      });

      if (userId) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { userType: "SHdfMU3Swb1UjJCP25VE" });
      }

      alert("Establishment registered successfully!");
      window.location.reload({userId});
    } catch (error) {
      alert("Failed to register establishment: " + error.message);
    }
  };

  return (
    <div className="reg-est-body">
      {/*Left Side*/}
      <div className="reg-est-logo-container">
        <a href="#" onClick={onRegEstablishClose}>
          <img className="reg-est-x-btn" src="assets/login_x_btn.png" />
        </a>
        <img src="assets/reg_establishment_logo.png" />
      </div>

      {/*Right Side*/}
      <div className="reg-est-container">
        <img src="assets/reg_establishment_bg.png" />
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Establishment Name*"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="est-description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address*"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="contactNumber"
            placeholder="Contact Number*"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />
          <input
            name="openingHours"
            placeholder="Opening Hours (e.g. 08:00 AM)*"
            value={form.openingHours}
            onChange={handleChange}
            required
          />
          <input
            name="closingHours"
            placeholder="Closing Hours (e.g. 10:00 PM)*"
            value={form.closingHours}
            onChange={handleChange}
            required
          />
          <div style={{ margin: "10px 0" }}>
            <label style={{ fontWeight: "bold" }}>Closed Days:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {DAYS.map(day => (
                <label key={day} style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={daysClosed.includes(day)}
                    onChange={handleCheckboxChange}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <button type="submit">
            &nbsp;REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}