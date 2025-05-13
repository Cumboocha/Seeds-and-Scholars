import ListPending from "./ListPending";
import NavBar from "./NavBar";
import RestoProfile from "./RestoProfile";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardAdmin() {
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const [screen, setScreen] = useState("list");
  const [selectedResto, setSelectedResto] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  const handleSelectResto = (resto) => {
    setSelectedResto(resto);
    setScreen("resto-profile");
  };

  const handleProfileClose = () => {
    setSelectedResto(null);
    setScreen("list");
  };

  const handleRegEstablishClose = () => {
    setScreen("list");
  };

  return (
    <div className="admin-body">
      <NavBar userId={userId} />
      <div className="admin-main">
        <div className="admin-left">
          <img src="assets/admin_img.png" className="admin-left-img" />
        </div>

        <div className="admin-right">
          {screen === "list" && (
            <ListPending
              setScreen={setScreen}
              userId={userId}
              onSelectResto={handleSelectResto}
            />
          )}

          {screen === "resto-profile" && selectedResto && (
            <RestoProfile
              setScreen={setScreen}
              userId={userId}
              resto={selectedResto}
              showPopup={showPopup}
              onClose={handleProfileClose}
            />
          )}

          {screen === "register" && (
            <RegEstablish
              userId={userId}
              onRegEstablishClose={handleRegEstablishClose}
              showPopup={showPopup}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {popupMessage && (
          <motion.div
            className="admin-popup"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p>{popupMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
