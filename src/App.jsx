import "./App.css";
import Landing from "./Landing";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import RegisterEstablishment from "./RegisterEstablishment";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Lines containing <AnimatePresence> and <motion.___> are for animation purposes.

function App() {
  const [activeScreen, setActiveScreen] = useState(null);
  // "login" | "signup"

  const handleLoginShow = () => setActiveScreen("login");
  const handleSignupShow = () => setActiveScreen("signup");
  const handleClose = () => setActiveScreen(null);

  return (
    <>
      <Landing
        onLoginBtnClick={handleLoginShow}
        onSignupBtnClick={handleSignupShow}
      />
      {/*Landing Screen*/}

      <AnimatePresence>
        {activeScreen === "login" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login onLoginClose={handleClose} /> {/*Login Screen*/}
          </motion.div>
        )}

        {activeScreen === "signup" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Signup onSignupClose={handleClose} /> {/*Signup Screen*/}
          </motion.div>
        )}
      </AnimatePresence>
      
    </>
  );
}

export default App;
