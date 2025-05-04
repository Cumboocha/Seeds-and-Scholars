import NavBar from "./NavBar";
import Map from "./Map";
import RestoProfile from "./RestoProfile";
import RegisterEstablishment from "./RegisterEstablishment";
import ListResto from "./ListResto";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [dashboardScreen, setDashboardScreen] = useState(null);
  const [RightScreen, setRightScreen] = useState("list");

  const handleRegEstClose = () => setDashboardScreen(null);
  const handleRightScreenChange = (right) => setRightScreen(right);

  return (
    <>
      <div className="dashboard-body">
        <NavBar />
        <div className="dashboard-main">
          <Map
            isAddingMarker={isAddingMarker}
            setIsAddingMarker={setIsAddingMarker}
            setDashboardScreen={setDashboardScreen}
            setRightScreen={setRightScreen}
          />

          {RightScreen === "list" && (
            <ListResto setRightScreen={handleRightScreenChange} />
          )}

          {RightScreen === "resto-profile" && (
            <RestoProfile setRightScreen={setRightScreen} />
          )}
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
          <RegisterEstablishment onRegEstablishClose={handleRegEstClose} />
        </motion.div>
      )}
    </>
  );
}
