import { useState } from "react";
import RestoAbout from "./RestoAbout";
import RestoMenu from "./RestoMenu";
import RestoReviews from "./RestoReviews";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function RestoProfile({ setScreen, resto, onClose, showPopup }) {
  const userId = sessionStorage.getItem("userId");
  const userType =
    sessionStorage.getItem("userType") || localStorage.getItem("userType");
  const [restoProfileScreen, setRestoProfileScreen] = useState("about");
  const [favorite, setFavorite] = useState("unfavorited");

  console.log(
    "userId:",
    userId,
    "resto.createdBy:",
    resto.createdBy,
    "userType:",
    userType
  );

  const handleRestoScreenChange = (screen) => setRestoProfileScreen(screen);

  const handleFavorite = async (fav) => {
    setFavorite(fav);

    if (fav === "favorited" && userId && resto && resto.id) {
      try {
        await addDoc(collection(db, "favorites"), {
          userId,
          restoId: resto.id,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        alert("Failed to add favorite: " + error.message);
      }
    } else if (fav === "unfavorited" && userId && resto && resto.id) {
      try {
        const favQuery = query(
          collection(db, "favorites"),
          where("userId", "==", userId),
          where("restoId", "==", resto.id)
        );
        const favSnapshot = await getDocs(favQuery);
        favSnapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "favorites", docSnap.id));
        });
      } catch (error) {
        alert("Failed to remove favorite: " + error.message);
      }
    }
  };

  const handleAccept = async () => {
    if (!resto?.id) return;
    try {
      await updateDoc(doc(db, "restaurants", resto.id), { isAccepted: true });
      showPopup?.("Establishment accepted!");
      if (onClose) onClose();
    } catch (error) {
      alert("Failed to accept establishment: " + error.message);
    }
  };

  const handleDecline = async () => {
    if (!resto?.id) return;
    try {
      await deleteDoc(doc(db, "restaurants", resto.id));
      showPopup?.("Establishment declined.");
      if (onClose) onClose();
    } catch (error) {
      alert("Failed to decline establishment: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!resto?.id) return;
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;
    try {
      await deleteDoc(doc(db, "restaurants", resto.id));
      alert("Restaurant deleted.");
      if (onClose) {
        onClose();
      } else {
        setScreen("list");
      }
    } catch (error) {
      alert("Failed to delete restaurant: " + error.message);
    }
  };

  if (!resto) return <div>Loading...</div>;

  return (
    <>
      <div className="resto-container-green-part">
        <div className="resto-header">
          <div className="resto-pfp">
            <img src="assets/resto_default_pfp.png" alt="Restaurant" />
          </div>

          <div className="resto-name-fav">
            <h1>{resto.name}</h1>
            {window.location.pathname === "/admin" ? (
              <div className="admin-buttons">
                <button className="accdec-resto-btn" onClick={handleAccept}>
                  ACCEPT
                </button>
                <button className="accdec-resto-btn" onClick={handleDecline}>
                  DECLINE
                </button>
              </div>
            ) : (
              <div className="user-buttons">
                {favorite === "unfavorited" ? (
                  <img
                    className="favorite-btn"
                    src="assets/favorite_btn.png"
                    onClick={() => handleFavorite("favorited")}
                    alt="Favorite"
                  />
                ) : (
                  <img
                    className="favorite-btn"
                    src="assets/favorite_btn_selected.png"
                    onClick={() => handleFavorite("unfavorited")}
                    alt="Unfavorite"
                  />
                )}
                {(userId === resto.createdBy ||
                  userType === "WcjOVRmHYXKZHsMzAVY2") && (
                  <button className="delete-resto-btn" onClick={handleDelete}>
                    DELETE
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {restoProfileScreen === "about" && (
          <RestoAbout resto={resto} userId={userId} />
        )}
        {restoProfileScreen === "menu" && (
          <RestoMenu resto={resto} userId={userId} />
        )}
        {restoProfileScreen === "reviews" && (
          <RestoReviews resto={resto} userId={userId} />
        )}

        <div className="resto-profile-tabs">
          <img
            src={
              restoProfileScreen === "about"
                ? "assets/about_tab_selected.png"
                : "assets/about_tab.png"
            }
            onClick={() => handleRestoScreenChange("about")}
            alt="About"
          />

          {window.location.pathname !== "/admin" && (
            <>
              <img
                src={
                  restoProfileScreen === "menu"
                    ? "assets/menu_tab_selected.png"
                    : "assets/menu_tab.png"
                }
                onClick={() => handleRestoScreenChange("menu")}
                alt="Menu"
              />
              <img
                src={
                  restoProfileScreen === "reviews"
                    ? "assets/reviews_tab_selected.png"
                    : "assets/reviews_tab.png"
                }
                onClick={() => handleRestoScreenChange("reviews")}
                alt="Reviews"
              />
            </>
          )}
        </div>
      </div>

      <div className="resto-close-btn-container">
        <img
          src="assets/resto_profile_x_btn.png"
          className="resto-x-btn"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              setScreen("list");
            }
          }}
          alt="Close"
        />
      </div>
    </>
  );
}
