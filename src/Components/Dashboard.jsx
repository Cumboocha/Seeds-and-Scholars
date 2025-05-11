import NavBar from "./NavBar";
import Map from "./Map";
import RestoProfile from "./RestoProfile";
import RegisterEstablishment from "./RegisterEstablishment";
import ListResto from "./ListResto";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard({ userId, handleLogout }) {
  if (userId) {
    localStorage.setItem("userId", userId);
    console.log("Logged in user ID:", userId);
  }

  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [dashboardScreen, setDashboardScreen] = useState(null);
  const [screen, setScreen] = useState("list");
  const [resto, setResto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRegEstClose = () => setDashboardScreen(null);
  const handlescreenChange = (screenName, restoData) => {
    setScreen(screenName);
    if (screenName === "resto-profile") setResto(restoData);
  };

  return (
    <>
      <div className="dashboard-body">
        <NavBar
          userId={userId}
          handleLogout={handleLogout}
          onSearch={setSearchTerm} 
        />
        <div className="dashboard-main">
          {screen === "list" && (
            <ListResto
              onscreenChange={handlescreenChange}
              userId={userId}
              searchTerm={searchTerm} 
            />
          )}

          {screen === "resto-profile" && (
            <div className="resto-container">
              <RestoProfile setScreen={setScreen} resto={resto} userId={userId} />
            </div>
          )}
          <Map
            isAddingMarker={isAddingMarker}
            setIsAddingMarker={setIsAddingMarker}
            setDashboardScreen={setDashboardScreen}
            setScreen={setScreen}
            userId={userId}
          />
        </div>

        <AnimatePresence>
          {isAddingMarker && (
            <motion.div
              className="add-marker-mode"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p>Click on the map to register your food establishment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {dashboardScreen === "reg-est" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RegisterEstablishment onRegEstablishClose={handleRegEstClose} userId={userId} />
        </motion.div>
      )}
    </>
  );
}
