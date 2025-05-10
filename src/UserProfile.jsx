import ListFavorites from "./ListFavorites";
import NavBar from "./NavBar";
import RestoProfile from "./RestoProfile";
import { useState } from "react";

export default function Profile() {
  const [rightScreen, setScreen] = useState("list");

  return (
    <div className="profile-body">
      <NavBar />
      <div className="profile-main">
        <div className="user-left-wrapper">
          <div className="user-left">
            <img src="assets/profile_bg.png" className="profile-bg" />
            <div className="profile-info">
              <img src="assets/user_default_pfp.png" className="user-pfp" />
              <p className="user-name">Juan Dela Cruz The Second</p>
            </div>
          </div>
        </div>

        <div className="user-right">
          {rightScreen === "list" && (
            <ListFavorites setScreen={setScreen} />
          )}

          {rightScreen === "resto-profile" && (
            <div className="resto-container" style={{width: "100%"}}>
              <RestoProfile
                setScreen={setScreen}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
