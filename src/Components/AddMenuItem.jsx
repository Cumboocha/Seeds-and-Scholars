import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

export default function AddMenuItem({ userId, restoId, handleMenuClose, handleMenuAdd }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim() || !price.trim()) return;

    try {
      const newDocRef = await addDoc(collection(db, "menu"), {
        name,
        description: desc,
        price: parseFloat(price),
        createdBy: userId,
        restoId,
        createdAt: new Date(),
      });

      handleMenuAdd({
        id: newDocRef.id,
        name,
        description: desc,
        price: parseFloat(price),
        createdBy: userId,
        restoId,
      });

      setName("");
      setDesc("");
      setPrice("");

      handleMenuClose();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  return (
    <div className="add-menu-item-body">
      <h1>Add Menu Item</h1>
      <div className="menu-item-form">
        <div className="menu-item-img">
          <img src="assets/menu_item_default.png" />
        </div>

        <div className="menu-item-form-info">
          <input
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Item Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            placeholder="Price (₱)"
            type="number"
            className="price-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="add-item-btns-container">
        <button className="add-menu-submit-btn" onClick={handleMenuClose}>
          CANCEL
        </button>
        <button className="add-menu-submit-btn" onClick={onSubmit}>
          ADD
        </button>
      </div>
    </div>
  );
}
