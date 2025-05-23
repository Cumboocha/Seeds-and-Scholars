import ListFavorites from "./ListFavorites";
import NavBar from "./NavBar";
import RestoProfile from "./RestoProfile";
import CardResto from "./CardResto";
import { useState, useEffect, useCallback } from "react";
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
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [favoritesChanged, setFavoritesChanged] = useState(false);

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

  useEffect(() => {
    async function fetchFavorites() {
      if (!userId) return;
      setLoadingFavorites(true);
      try {
        const favsQuery = query(
          collection(db, "favorites"),
          where("userId", "==", userId)
        );
        const favsSnapshot = await getDocs(favsQuery);

        const favRestos = await Promise.all(
          favsSnapshot.docs.map(async (docSnap) => {
            const favData = docSnap.data();
            const restoRef = doc(db, "restaurants", favData.restoId);
            const restoSnap = await getDoc(restoRef);
            return restoSnap.exists()
              ? { id: restoSnap.id, ...restoSnap.data() }
              : null;
          })
        );

        setFavorites(favRestos.filter((r) => r !== null));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
      setLoadingFavorites(false);
    }

    fetchFavorites();
  }, [userId, favoritesChanged]);

  const handleUnfavorite = useCallback((restoId) => {
    setFavorites((prev) => prev.filter((resto) => resto.id !== restoId));
    setFavoritesChanged((prev) => !prev);
  }, []);

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
              <p className="user-name">
                {userName || <div className="spinner"></div>}
              </p>
            </div>
          </div>
        </div>
        <div
          className="user-right"
          style={{ overflowY: rightScreen === "resto-profile" ? "hidden" : "auto", maxHeight: "calc(100vh - 40px)" }}
        >
          {rightScreen === "resto-profile" && selectedResto ? (
            <div className="resto-container" style={{ width: "100%" }}>
              <RestoProfile
                setScreen={setRightScreen}
                userId={userId}
                resto={selectedResto}
                onClose={() => setRightScreen("favorites")}
                style={{ width: "100%" }}
                onUnfavorite={handleUnfavorite}
              />
            </div>
          ) : (
            <>
              {userType !== "WcjOVRmHYXKZHsMzAVY2" && (
                <div className="my-restos-section">
                  {userType === "SHdfMU3Swb1UjJCP25VE" && (
                    <>
                      <h1 className="favorites-text">Your Restaurants</h1>
                      {loadingMyRestos ? (
                        <div className="spinner-container">
                          <div className="spinner"></div>
                        </div>
                      ) : myRestos.length === 0 ? (
                        <div className="no-est-found">
                          <img src="assets/no_establishment_found.png" />
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
                    </>
                  )}

                  <div className="favorites-section" style={{marginBottom: "75px"}}>
                    <ListFavorites
                      favorites={favorites}
                      loading={loadingFavorites}
                      onSelectResto={handleSelectResto}
                      onUnfavorite={handleUnfavorite}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
