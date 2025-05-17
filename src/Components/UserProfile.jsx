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
  const [favoriteRestos, setFavoriteRestos] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [selectedResto, setSelectedResto] = useState(null);
  const [rightScreen, setRightScreen] = useState("favorites");
  const [myRestos, setMyRestos] = useState([]);
  const [loadingMyRestos, setLoadingMyRestos] = useState(true);

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
    async function fetchFavorites() {
      if (!userId) return;
      setLoadingFavs(true);
      const favQuery = query(
        collection(db, "favorites"),
        where("userId", "==", userId)
      );
      const favSnapshot = await getDocs(favQuery);
      const restoIds = favSnapshot.docs.map((doc) => doc.data().restoId);

      const restoPromises = restoIds.map((restoId) =>
        getDoc(doc(db, "restaurants", restoId))
      );
      const restoSnaps = await Promise.all(restoPromises);
      const restos = restoSnaps
        .filter((snap) => snap.exists())
        .map((snap) => ({ id: snap.id, ...snap.data() }));

      setFavoriteRestos(restos);
      setLoadingFavs(false);
    }
    fetchFavorites();
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
              <div className="my-restos-section">
                <h1 className="favorites-text">Your Restaurant</h1>
                {loadingMyRestos ? (
                  <p>Loading...</p>
                ) : myRestos.length === 0 ? (
                  <p>You have not added a restaurant yet.</p>
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
              <ListFavorites
                favorites={favoriteRestos}
                loading={loadingFavs}
                onSelectResto={handleSelectResto}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
