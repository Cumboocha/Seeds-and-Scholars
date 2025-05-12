import { useState } from "react";
import RestoAbout from "./RestoAbout";
import RestoMenu from "./RestoMenu";
import RestoReviews from "./RestoReviews";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function RestoProfile({ setScreen, resto, onClose }) {
  const userId = sessionStorage.getItem("userId") 
  const [restoProfileScreen, setRestoProfileScreen] = useState("about");
  const [favorite, setFavorite] = useState("unfavorited");

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
          </div>
        </div>

        {restoProfileScreen === "about" && <RestoAbout resto={resto} userId={userId} />}
        {restoProfileScreen === "menu" && <RestoMenu resto={resto} userId={userId} />}
        {restoProfileScreen === "reviews" && <RestoReviews resto={resto} userId={userId} />}

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
