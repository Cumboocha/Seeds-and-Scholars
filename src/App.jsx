import "./App.css";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("hasVisited")) {
      sessionStorage.clear();
      localStorage.clear();
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId"));
  const [userType, setUserType] = useState(null);
  const [activeScreen, setActiveScreen] = useState(() =>
    sessionStorage.getItem("userId") ? "dashboard" : null
  );

  const handleLoginShow = () => setActiveScreen("login");
  const handleSignupShow = () => setActiveScreen("signup");
  const handleClose = () => setActiveScreen(null);

  const handleLoginSuccess = (userId) => {
    setUserId(userId);
    sessionStorage.setItem("userId", userId);

    setActiveScreen("dashboard");
  };

  useEffect(() => {
  const fetchUserType = async () => {
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserType(data.userType);
        sessionStorage.setItem("userType", data.userType); // Save for later use
      }
    }
  };
  fetchUserType();
}, [userId]);

  const handleLogout = () => {
    setUserId(null);
    setActiveScreen(null);
    sessionStorage.clear();
  };

  useEffect(() => {
    const checkUserId = () => {
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) {
        setUserId(null);
        setActiveScreen(null);
      }
    };
    window.addEventListener("storage", checkUserId);
    return () => window.removeEventListener("storage", checkUserId);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("userId")) {
      setUserId(null);
      setActiveScreen(null);
    }
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Landing
        onLoginBtnClick={handleLoginShow}
        onSignupBtnClick={handleSignupShow}
      />

      <AnimatePresence>
        {activeScreen === "login" && (
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
              justifyContent: "center"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLoginClose={handleClose} onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {activeScreen === "signup" && (
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
              justifyContent: "center"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Signup onSignupClose={handleClose} />
          </motion.div>
        )}

        {activeScreen === "dashboard" && userId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Dashboard userId={userId} handleLogout={handleLogout}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
