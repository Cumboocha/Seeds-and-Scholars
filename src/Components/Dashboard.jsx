import NavBar from "./NavBar";
import Map from "./Map";
import RestoProfile from "./RestoProfile";
import RegisterEstablishment from "./RegisterEstablishment";
import ListResto from "./ListResto";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export default function Dashboard({ handleLogout }) {
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [dashboardScreen, setDashboardScreen] = useState(null);
  const [screen, setScreen] = useState("list");
  const [resto, setResto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [markerCoords, setMarkerCoords] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const reloadDashboard = () => {
    window.location.reload();
  };

  const handleRegEstClose = () => {
    setDashboardScreen(null);
    setScreen("list");
    setMarkerCoords(null);
    reloadDashboard();
  };

  const handlescreenChange = (screenName, restoData) => {
    setScreen(screenName);
    if (screenName === "resto-profile") {
      setResto(restoData);
      setSelectedMarkerId(restoData?.id); 
    }
  };

  const handleProfileClose = () => {
    setScreen("list");
    setIsProfileOpen(false);
    setSelectedMarkerId(null); 
  };

  const handleMarkerPlaced = async (marker) => {
    if (marker.lat && marker.lng) {
      setMarkerCoords({ lat: marker.lat, lng: marker.lng });
    }

    if (marker.id) {
      const docRef = doc(db, "restaurants", marker.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResto({ id: marker.id, ...docSnap.data() });
      } else {
        setResto(marker);
      }
    } else {
      setResto(marker);
    }
    setScreen("resto-profile");
    setIsProfileOpen(true);
  };

  const isRegEstOpen = dashboardScreen === "reg-est";

  return (
    <>
      <div className={`dashboard-body${isRegEstOpen ? " modal-open" : ""}`}>
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

          {screen === "resto-profile" && resto && !isRegEstOpen && (
            <div className="resto-container">
              <RestoProfile
                setScreen={setScreen}
                resto={resto}
                userId={userId}
                onClose={handleProfileClose} 
              />
            </div>
          )}
          <Map
            isAddingMarker={isAddingMarker}
            setIsAddingMarker={setIsAddingMarker}
            setDashboardScreen={setDashboardScreen}
            setScreen={setScreen}
            userId={userId}
            onMarkerPlaced={handleMarkerPlaced}
            isProfileOpen={isProfileOpen}
            selectedMarkerId={selectedMarkerId}
            setSelectedMarkerId={setSelectedMarkerId}
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
              <p style={{ color: "white" }}>
                Click on the map to register your food establishment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isRegEstOpen && (
        <>
          <div className="dashboard-overlay" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="register-modal"
            style={{ zIndex: 2000, position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <RegisterEstablishment
              onRegEstablishClose={handleRegEstClose}
              userId={userId}
              markerCoords={markerCoords}
            />
          </motion.div>
        </>
      )}
    </>
  );
}
