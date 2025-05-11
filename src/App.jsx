import "./App.css";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("hasVisited")) {
      sessionStorage.clear();
      localStorage.clear();
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId"));
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
    <>
      {activeScreen === null && (
        <Landing
          onLoginBtnClick={handleLoginShow}
          onSignupBtnClick={handleSignupShow}
        />
      )}

      <AnimatePresence>
        {activeScreen === "login" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLoginClose={handleClose} onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {activeScreen === "signup" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Signup onSignupClose={handleClose} />
          </motion.div>
        )}

        {/* Only show Dashboard if logged in and activeScreen is dashboard */}
        {activeScreen === "dashboard" && userId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Dashboard userId={userId} handleLogout={handleLogout}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
