import { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function EditResto({ resto, onClose, onProfileUpdated }) {
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [name, setName] = useState(resto?.name || "");
  const [description, setDescription] = useState(resto?.description || "");
  const [address, setAddress] = useState(resto?.address || "");
  const [contactNumber, setContactNumber] = useState(resto?.contactNumber || "");
  const [openingHours, setOpeningHours] = useState(resto?.openingHours || "");
  const [closingHours, setClosingHours] = useState(resto?.closingHours || "");
  const [daysClosed, setDaysClosed] = useState(
    Array.isArray(resto?.daysClosed)
      ? resto.daysClosed
      : typeof resto?.daysClosed === "string"
      ? resto.daysClosed.split(",").map((d) => d.trim())
      : []
  );

  const handleCheckboxChange = (day) => {
    setDaysClosed((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = async () => {
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
      alert("Failed to update profile: " + error.message);
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
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="resto-schedule-container">
                <div className="schedule-img-container">
                  <img src="assets/clock_symbol.png" />
                </div>
                <div className="schedule-details-container">
                  <input
                    className="resto-edit-input"
                    placeholder="Opening Hour"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                  <input
                    className="resto-edit-input"
                    placeholder="Closing Hour"
                    value={closingHours}
                    onChange={(e) => setClosingHours(e.target.value)}
                  />
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
            </div>
          </div>
        </div>
        <div className="edit-right">
          <img src="assets/edit_mode_logo.png" className="edit-logo" />
          <div className="edit-buttons">
            <button className="edit-save" onClick={handleSave}>SAVE</button>
            <button className="edit-cancel" onClick={onClose}>CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}
