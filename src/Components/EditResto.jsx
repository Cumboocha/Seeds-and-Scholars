import { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function EditResto({ resto, onClose, onProfileUpdated }) {
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Split opening/closing hours into hour, minute, period for validation
  const parseTime = (timeStr = "") => {
    const match = timeStr.match(/^(\d{2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return ["", "", "AM"];
    return [match[1], match[2], match[3].toUpperCase()];
  };

  const [name, setName] = useState(resto?.name || "");
  const [description, setDescription] = useState(resto?.description || "");
  const [address, setAddress] = useState(resto?.address || "");
  const [contactNumber, setContactNumber] = useState(resto?.contactNumber || "");
  const [openingHour, setOpeningHour] = useState(parseTime(resto?.openingHours)[0]);
  const [openingMinute, setOpeningMinute] = useState(parseTime(resto?.openingHours)[1]);
  const [openingPeriod, setOpeningPeriod] = useState(parseTime(resto?.openingHours)[2]);
  const [closingHour, setClosingHour] = useState(parseTime(resto?.closingHours)[0]);
  const [closingMinute, setClosingMinute] = useState(parseTime(resto?.closingHours)[1]);
  const [closingPeriod, setClosingPeriod] = useState(parseTime(resto?.closingHours)[2]);
  const [daysClosed, setDaysClosed] = useState(
    Array.isArray(resto?.daysClosed)
      ? resto.daysClosed
      : typeof resto?.daysClosed === "string"
      ? resto.daysClosed.split(",").map((d) => d.trim())
      : []
  );
  const [error, setError] = useState("");

  const pad = (val) => val.toString().padStart(2, "0");

  const handleCheckboxChange = (day) => {
    setDaysClosed((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = async () => {
    setError("");
    // Validate hours and minutes
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
    if (!/^\d{10,12}$/.test(contactNumber)) {
      setError("Contact number must be numeric and 10 to 12 digits.");
      return;
    }

    // Confirm before saving
    const confirmed = window.confirm("Are you sure you want to save these changes?");
    if (!confirmed) return;

    const openingHours = `${pad(openingHour)}:${pad(openingMinute)} ${openingPeriod}`;
    const closingHours = `${pad(closingHour)}:${pad(closingMinute)} ${closingPeriod}`;

    if (!resto?.id) return;
    try {
      await updateDoc(doc(db, "restaurants", resto.id), {
        name,
        description,
        address,
        contactNumber,
        openingHours,
        closingHours,
        daysClosed,
      });
      if (onProfileUpdated) onProfileUpdated();
      if (onClose) onClose();
      alert("Profile updated!");
    } catch (error) {
      setError("Failed to update profile: " + error.message);
    }
  };

  return (
    <div className="edit-body">
      <div className="navbar-fake">.</div>
      <div className="edit-main">
        <div className="edit-left">
          <div className="resto-container-green-part">
            <div className="resto-header">
              <div className="resto-pfp">
                <img src="assets/resto_default_pfp.png" alt="Restaurant" />
              </div>
              <div className="resto-name-fav">
                <input
                  className="resto-edit-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Restaurant Name"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                  required
                />
              </div>
            </div>

            <div className="resto-container-white-part">
              <h2 className="resto-text-header" style={{ marginTop: "25px" }}>
                About the Establishment
              </h2>
              <textarea
                className="resto-edit-textarea"
                placeholder="Write a description."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <hr />

              <div className="resto-address-container">
                <div className="address-img-container">
                  <img src="assets/address_symbol.png" />
                </div>
                <div className="address-details-container">
                  <input
                    className="resto-edit-input"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="resto-phone-container">
                <div className="phone-img-container">
                  <img src="assets/phone_symbol.png" />
                </div>
                <div className="phone-details-container">
                  <input
                    className="resto-edit-input"
                    placeholder="Phone Number"
                    value={contactNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 12) setContactNumber(val);
                    }}
                    required
                    maxLength={12}
                  />
                </div>
              </div>

              <div className="resto-schedule-container">
                <div className="schedule-img-container">
                  <img src="assets/clock_symbol.png" />
                </div>
                <div className="schedule-details-container" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label>Opening Hour</label>
                  <input
                    className="resto-edit-input"
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
                    style={{ width: "50px" }}
                  />
                  :
                  <input
                    className="resto-edit-input"
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
                    style={{ width: "50px" }}
                  />
                  <select value={openingPeriod} onChange={e => setOpeningPeriod(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  <label>Closing Hour</label>
                  <input
                    className="resto-edit-input"
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
                    style={{ width: "50px" }}
                  />
                  :
                  <input
                    className="resto-edit-input"
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
                    style={{ width: "50px" }}
                  />
                  <select value={closingPeriod} onChange={e => setClosingPeriod(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="resto-closed-container">
                <div className="closed-days-img-container">.</div>
                <div className="closed-details-container">
                  <p style={{ fontWeight: "bolder" }}>Closed Days</p>
                  <div
                    className="closed-days-checkboxes"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    {DAYS.map((day) => (
                      <label
                        key={day}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="closedDays"
                          value={day}
                          checked={daysClosed.includes(day)}
                          onChange={() => handleCheckboxChange(day)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Error message before the save button */}
              {error && (
                <div style={{ color: "red", margin: "10px 0", fontWeight: "bold" }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="edit-right">
          <img src="assets/edit_mode_logo.png" className="edit-logo" />
          <div className="edit-buttons">
            <button className="edit-save" onClick={handleSave} type="button">SAVE</button>
            <button className="edit-cancel" onClick={onClose} type="button">CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}
