import { useState } from "react";
import EditResto from "./EditResto";
import { AnimatePresence, motion } from "framer-motion";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function RestoAbout({ resto, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const userId = sessionStorage.getItem("userId");
  const userType =
    sessionStorage.getItem("userType") 

  if (!resto) return <div>Loading...</div>;

  if (isEditing) {
    return (
      <AnimatePresence>
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 10,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <EditResto
            resto={resto}
            onClose={() => setIsEditing(false)}
            onProfileUpdated={onProfileUpdated}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  const daysClosed = Array.isArray(resto.daysClosed)
    ? resto.daysClosed
    : typeof resto.daysClosed === "string"
    ? resto.daysClosed.split(",").map(day => day.trim()).filter(Boolean)
    : [];

  return (
    <div className="resto-container-white-part">
      <div className="resto-about-header">
        <h2 className="resto-text-header">About the Establishment</h2>
        {resto.isAccepted &&
          (userId === resto.createdBy || userType === "WcjOVRmHYXKZHsMzAVY2") && (
            <img
              src="assets/edit_btn.png"
              onClick={() => setIsEditing(true)}
              style={{ cursor: "pointer" }}
              alt="Edit"
            />
          )}
      </div>
      <p className="resto-desc">{resto.description}</p>
      <hr />

      <div className="resto-address-container">
        <div className="address-img-container">
          <img src="assets/address_symbol.png" alt="Address" />
        </div>
        <div className="address-details-container">
          <p>{resto.address}</p>
        </div>
      </div>

      <div className="resto-phone-container">
        <div className="phone-img-container">
          <img src="assets/phone_symbol.png" alt="Phone" />
        </div>
        <div className="phone-details-container">
          <p>{resto.contactNumber}</p>
        </div>
      </div>

      <div className="resto-schedule-container">
        <div className="schedule-img-container">
          <img src="assets/clock_symbol.png" alt="Schedule" />
        </div>
        <div className="schedule-details-container">
          <div style={{ marginBottom: "5px", fontWeight: "bold" }}>Schedule:</div>
          <table>
            <tbody>
              {DAYS.map(day => (
                <tr key={day}>
                  <td>{day}</td>
                  <td className="second-col">
                    {daysClosed.includes(day)
                      ? "Closed"
                      : resto.openingHours && resto.closingHours
                      ? `${resto.openingHours} - ${resto.closingHours}`
                      : "Open"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
