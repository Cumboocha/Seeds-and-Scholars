import { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import AddMenuItem from "./AddMenuItem";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function RestoMenu({ userId, resto }) {
  const [menuItems, setMenuItems] = useState([]);
  const [menuScreen, setMenuScreen] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function checkOwner() {
      if (resto && resto.id && userId) {
        const restoRef = doc(db, "restaurants", resto.id);
        const restoSnap = await getDoc(restoRef);
        if (restoSnap.exists()) {
          setIsOwner(restoSnap.data().createdBy === userId);
        }
      }
    }
    checkOwner();
  }, [resto, userId]);

  const handleMenuScreenChange = () => setMenuScreen("add-item");
  const handleMenuClose = () => setMenuScreen(null);

  function handleMenuAdd() {
    setMenuItems([...menuItems, <MenuItem userId={userId} />]);
    handleMenuClose();
  }

  return (
    <div className="resto-container-white-part">
      {isOwner && (
        <div className="add-item-container" onClick={handleMenuScreenChange}>
          <p> + </p>
        </div>
      )}
      {isOwner && <hr />}
      <h2 className="resto-text-header">Menu</h2>
      {menuItems.length === 0 ? (
        <div className="nothing-here">
          <img src="assets/nothing_here.png" />
        </div>
      ) : (
        menuItems.map((item, index) => <div key={index}>{item}</div>)
      )}

      {isOwner && menuScreen === "add-item" && (
        <AddMenuItem
          userId={userId}
          handleMenuClose={handleMenuClose}
          handleMenuAdd={handleMenuAdd}
        />
      )}
    </div>
  );
}
