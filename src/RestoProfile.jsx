import { useState } from "react";
import RestoAbout from "./RestoAbout";
import RestoMenu from "./RestoMenu";
import RestoReviews from "./RestoReviews";

export default function RestoProfile({ setLeftScreen }) {
  const [restoProfileScreen, setRestoProfileScreen] = useState("about");
  // "about" | "menu" | "reviews"
  const [favorite, setFavorite] = useState("unfavorited");

  const handleRestoScreenChange = (screen) => setRestoProfileScreen(screen);

  const handleFavorite = (fav) => setFavorite(fav);

  return (
    <div className="resto-container">
      <div className="resto-container-green-part">
        <div className="resto-header">
          <div className="resto-pfp">
            <img src="assets/resto_default_pfp.png" />
          </div>

          <div className="resto-name-fav">
            <h1>Kusinang Bayan</h1>
            {favorite === "unfavorited" && (
              <img
                className="favorite-btn"
                src="assets/favorite_btn.png"
                onClick={() => handleFavorite("favorited")}
              />
            )}

            {favorite === "favorited" && (
              <img
                className="favorite-btn"
                src="assets/favorite_btn_selected.png"
                onClick={() => handleFavorite("unfavorited")}
              />
            )}
          </div>
        </div>

        {restoProfileScreen === "about" && <RestoAbout />}
        {restoProfileScreen === "menu" && <RestoMenu />}
        {restoProfileScreen === "reviews" && <RestoReviews />}

        <div className="resto-profile-tabs">
          <img
            src={
              restoProfileScreen === "about"
                ? "assets/about_tab_selected.png"
                : "assets/about_tab.png"
            }
            onClick={() => handleRestoScreenChange("about")}
          />
          <img
            src={
              restoProfileScreen === "menu"
                ? "assets/menu_tab_selected.png"
                : "assets/menu_tab.png"
            }
            onClick={() => handleRestoScreenChange("menu")}
          />
          <img
            src={
              restoProfileScreen === "reviews"
                ? "assets/reviews_tab_selected.png"
                : "assets/reviews_tab.png"
            }
            onClick={() => handleRestoScreenChange("reviews")}
          />
        </div>
      </div>

      <div className="resto-close-btn-container">
        <img
          src="assets/resto_profile_x_btn.png"
          className="resto-x-btn"
          onClick={() => setLeftScreen("list")}
        />
      </div>
    </div>
  );
}
