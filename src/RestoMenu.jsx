import MenuItem from "./MenuItem";
import AddMenuItem from "./AddMenuItem";
import { useState } from "react";

export default function RestoMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuScreen, setMenuScreen] = useState(null);

  const handleMenuScreenChange = () => setMenuScreen("add-item");
  const handleMenuClose = () => setMenuScreen(null);

  function handleMenuAdd() {
    setMenuItems([...menuItems, <MenuItem />]);
    handleMenuClose();
  }

  return (
    <div className="resto-container-white-part">
      <div className="add-item-container" onClick={handleMenuScreenChange}> {/*To back-end devs: if user isnt owner, hide this div (and the <hr/>)*/}
        <p> + </p> 
      </div>
      <hr />
      <h2 className="resto-text-header">Menu</h2>
      {menuItems.length === 0 ? (
        <div className="nothing-here">
          <img src="assets/nothing_here.png" />
        </div>
      ) : (
        menuItems.map((item, index) => <div key={index}>{item}</div>)
      )}

      {menuScreen === "add-item" && (
        <AddMenuItem
          handleMenuClose={handleMenuClose}
          handleMenuAdd={handleMenuAdd}
        />
      )}
    </div>
  );
}
