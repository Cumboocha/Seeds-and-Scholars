import ListFavorites from "./ListFavorites";
import NavBar from "./NavBar";
import RestoProfile from "./RestoProfile";
import CardResto from "./CardResto";
import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function UserProfile() {
  const userId = sessionStorage.getItem("userId");
  const [userName, setUserName] = useState("");
  const [selectedResto, setSelectedResto] = useState(null);
  const [rightScreen, setRightScreen] = useState("favorites");
  const [myRestos, setMyRestos] = useState([]);
  const [loadingMyRestos, setLoadingMyRestos] = useState(true);

  // Get userType
  const userType =
    sessionStorage.getItem("userType") || localStorage.getItem("userType");

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

  useEffect(() => {
    async function fetchMyRestos() {
      if (!userId) return;
      setLoadingMyRestos(true);
      const myRestosQuery = query(
        collection(db, "restaurants"),
        where("createdBy", "==", userId)
      );
      const myRestosSnapshot = await getDocs(myRestosQuery);
      const restos = myRestosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyRestos(restos);
      setLoadingMyRestos(false);
    }
    fetchMyRestos();
  }, [userId]);

  const handleSelectResto = (resto) => {
    setSelectedResto(resto);
    setRightScreen("resto-profile");
  };

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
        <div className="user-right">
          {rightScreen === "resto-profile" && selectedResto ? (
            <div className="resto-container" style={{ width: "100%" }}>
              <RestoProfile
                setScreen={setRightScreen}
                userId={userId}
                resto={selectedResto}
                onClose={() => setRightScreen("favorites")}
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <>
              {userType !== "WcjOVRmHYXKZHsMzAVY2" && (
                <div className="my-restos-section">
                  <h1 className="favorites-text">Your Restaurants</h1>
                  {loadingMyRestos ? (
                    <p>Loading...</p>
                  ) : myRestos.length === 0 ? (
                    <div className="no-est-found">
                      <img src="assets/no_establishment_found.png"/>
                    </div>
                  ) : (
                    myRestos.map((resto) => (
                      <div
                        key={resto.id}
                        onClick={() => handleSelectResto(resto)}
                        style={{ cursor: "pointer" }}
                      >
                        <CardResto resto={resto} userId={userId} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
