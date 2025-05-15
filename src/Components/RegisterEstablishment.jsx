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
  const [error, setError] = useState(""); // <-- Add error state

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
    setError(""); // Reset error

    // Validate hours and minutes
    const pad = (val) => val.toString().padStart(2, "0");
    const oh = Number(openingHour);
    const om = Number(openingMinute);
    const ch = Number(closingHour);
    const cm = Number(closingMinute);

    if (
      isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm) ||
      oh < 1 || oh > 12 ||
      ch < 1 || ch > 12 ||
      om < 0 || om > 59 ||
      cm < 0 || cm > 59 ||
      openingHour.length === 0 || closingHour.length === 0 ||
      openingMinute.length === 0 || closingMinute.length === 0 ||
      openingHour.length > 2 || closingHour.length > 2 ||
      openingMinute.length > 2 || closingMinute.length > 2
    ) {
      setError("Please enter valid hours (01-12) and minutes (00-59) in 12-hour format. Hours 1-9 must begin with 0.");
      return;
    }
    if (
      (oh < 10 && openingHour.length !== 2) ||
      (ch < 10 && closingHour.length !== 2) ||
      (om < 10 && openingMinute.length !== 2) ||
      (cm < 10 && closingMinute.length !== 2)
    ) {
      setError("Hours and minutes from 1-9 must begin with 0 (e.g., 01, 02, ... 09).");
      return;
    }

    // Validate contact number
    if (!/^\d{10,12}$/.test(form.contactNumber)) {
      setError("Contact number must be numeric and 10 to 12 digits.");
      return;
    }

    // Confirmation before registering
    const confirmed = window.confirm("Are you sure you want to register this business?");
    if (!confirmed) return;

    const openingHours = `${pad(openingHour)}:${pad(openingMinute)} ${openingPeriod}`;
    const closingHours = `${pad(closingHour)}:${pad(closingMinute)} ${closingPeriod}`;

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

      alert("Establishment registered successfully! Please wait for admin approval.");
      window.location.reload();
    } catch (error) {
      setError("Failed to register establishment: " + error.message);
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
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Contact Number*"
            value={form.contactNumber}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 11) {
                setForm({ ...form, contactNumber: val });
              }
            }}
            required
            maxLength={11}
          />
          <div className="opening-closing-container">
            <label>Opening Hours*</label>
            <input
              type="number"
              min="1"
              max="12"
              placeholder="HH"
              value={openingHour}
              onChange={e => {
                if (e.target.value.length <= 2) setOpeningHour(e.target.value);
              }}
              required
              maxLength={2}
            />
            :
            <input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={openingMinute}
              onChange={e => {
                if (e.target.value.length <= 2) setOpeningMinute(e.target.value);
              }}
              required
              maxLength={2}
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
              onChange={e => {
                if (e.target.value.length <= 2) setClosingHour(e.target.value);
              }}
              required
              maxLength={2}
            />
            :
            <input
              type="number"
              min="0"
              max="59"
              placeholder="MM"
              value={closingMinute}
              onChange={e => {
                if (e.target.value.length <= 2) setClosingMinute(e.target.value);
              }}
              required
              maxLength={2}
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
          {/* Error message before the register button */}
          {error && (
            <div style={{ color: "red", margin: "10px 0", fontWeight: "bold" }}>
              {error}
            </div>
          )}
          <button type="submit">&nbsp;REGISTER</button>
        </form>
      </div>
    </div>
  );
}
