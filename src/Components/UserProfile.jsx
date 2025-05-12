import ListFavorites from "./ListFavorites";
import NavBar from "./NavBar";
import RestoProfile from "./RestoProfile";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function UserProfile() {
  const userId = sessionStorage.getItem("userId") 
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserName() {
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(`${data.firstName || ""} ${data.lastName || ""}`.trim());
        }
      }
    }
    fetchUserName();
  }, [userId]);

  return (
    <div className="profile-body">
      <NavBar userId={userId} />
      <div className="profile-main">
        <div className="user-left-wrapper">
          <div className="user-left">
            <img src="assets/profile_bg.png" className="profile-bg" />
            <div className="profile-info">
              <img src="assets/user_default_pfp.png" className="user-pfp" />
              <p className="user-name">{userName || "Loading..."}</p>
            </div>
          </div>
        </div>
        {/* <div className="user-right">
          {rightScreen === "list" && (
            <ListFavorites setScreen={setScreen} userId={userId} />
          )}

          {rightScreen === "resto-profile" && (
            <div className="resto-container" style={{width: "100%"}}>
              <RestoProfile
                setScreen={setScreen}
                userId={userId}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
