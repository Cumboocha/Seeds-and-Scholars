import { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

// Initialize Firebase app and Firestore (ensure this is only called once in your app)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export default function RegisterEstablishment({
  onRegEstablishClose,
  markerCoords,
}) {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    contactNumber: "",
    openingHours: "",
    closingHours: "",
  });
  //console.log("Marker Coordinates:", markerCoords);

  const [daysClosed, setDaysClosed] = useState([]);
  const [openingHour, setOpeningHour] = useState("");
  const [openingMinute, setOpeningMinute] = useState("");
  const [openingPeriod, setOpeningPeriod] = useState("AM");
  const [closingHour, setClosingHour] = useState("");
  const [closingMinute, setClosingMinute] = useState("");
  const [closingPeriod, setClosingPeriod] = useState("PM");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDaysClosed([...daysClosed, value]);
    } else {
      setDaysClosed(daysClosed.filter((day) => day !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const openingHours = `${openingHour.padStart(2, "0")}:${openingMinute.padStart(2, "0")} ${openingPeriod}`;
    const closingHours = `${closingHour.padStart(2, "0")}:${closingMinute.padStart(2, "0")} ${closingPeriod}`;
    try {
      await addDoc(collection(db, "restaurants"), {
        name: form.name,
        description: form.description,
        address: form.address,
        contactNumber: form.contactNumber,
        openingHours: openingHours,
        closingHours: closingHours,
        daysClosed: daysClosed,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId || "admin",
        updatedBy: userId || "admin",
        latitude: markerCoords?.lat || 0,
        longitude: markerCoords?.lng || 0,
        isAccepted: false,
      });

      if (userId) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { userType: "SHdfMU3Swb1UjJCP25VE" });
      }

      alert("Establishment registered successfully!");
      window.location.reload();
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
          <div className="opening-closing-container">
            <label>Opening Hours*</label>
            <input
              type="number"
              min="1"
              max="12"
              placeholder="HH"
              value={openingHour}
              onChange={e => setOpeningHour(e.target.value)}
              required
            />
            :
            <input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={openingMinute}
              onChange={e => setOpeningMinute(e.target.value)}
              required
            />
            <select value={openingPeriod} onChange={e => setOpeningPeriod(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>

          </div>
                    <div className="opening-closing-container">
 <label>Closing Hours*</label>
            <input
              type="number"
              min="1"
              max="12"
              placeholder="HH"
              value={closingHour}
              onChange={e => setClosingHour(e.target.value)}
              required
            />
            :
            <input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={closingMinute}
              onChange={e => setClosingMinute(e.target.value)}
              required
            />
            <select value={closingPeriod} onChange={e => setClosingPeriod(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>

          </div>
          <div className="closed-days">
            <p style={{ fontWeight: "bold" }}>Closed Days:</p>
            <div style={{width: "90%", display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "space-evenly"}}>
              {DAYS.map((day) => (
                <label
                  key={day}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={daysClosed.includes(day)}
                    onChange={handleCheckboxChange}
                    className="checkbox-box"
                  />
                  <span className="custom-checkbox"></span>
                  {day}
                </label>
              ))}
            </div>
          </div>
          <button type="submit">&nbsp;REGISTER</button>
        </form>
      </div>
    </div>
  );
}
