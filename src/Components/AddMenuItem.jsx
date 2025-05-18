import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const db = getFirestore();

const swalWithCrossfade = Swal.mixin({
  showClass: { popup: "animate__animated animate__fadeIn" },
  hideClass: { popup: "animate__animated animate__fadeOut" },
});

const applySwalStyling = () => {
  setTimeout(() => {
    const confirmButton = document.querySelector('.swal2-confirm');
    if (confirmButton) {
      confirmButton.style.backgroundColor = '#89bd2e';
      confirmButton.style.color = 'white';
      confirmButton.style.borderRadius = '15px';
      confirmButton.style.fontFamily = 'Montserrat';
      confirmButton.style.boxShadow = 'none';
      confirmButton.style.padding = '10px 24px';
      confirmButton.style.outline = 'none';
    }
    const cancelButton = document.querySelector('.swal2-cancel');
    if (cancelButton) {
      cancelButton.style.backgroundColor = '#dd2e44';
      cancelButton.style.color = 'white';
      cancelButton.style.borderRadius = '15px';
      cancelButton.style.fontFamily = 'Montserrat';
      cancelButton.style.boxShadow = 'none';
      cancelButton.style.padding = '10px 24px';
      cancelButton.style.outline = 'none';
    }
    const swalContainer = document.querySelector('.swal2-popup');
    if (swalContainer) {
      swalContainer.style.width = '600px';
      swalContainer.style.borderRadius = '20px';
      swalContainer.style.backgroundColor = '#f8f9fa';
    }
    const swalTitle = document.querySelector('.swal2-title');
    if (swalTitle) {
      swalTitle.style.color = '#2c3e50';
      swalTitle.style.fontFamily = 'Montserrat';
      swalTitle.style.fontSize = '24px';
      swalTitle.style.fontWeight = 'bold';
    }
    const swalContent = document.querySelector('.swal2-html-container');
    if (swalContent) {
      swalContent.style.color = '#34495e';
      swalContent.style.fontFamily = 'Montserrat';
      swalContent.style.fontSize = '18px';
    }
  }, 10);
};

export default function AddMenuItem({ userId, restoId, handleMenuClose, handleMenuAdd }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !desc.trim() || !price.trim()) {
      await swalWithCrossfade.fire({
        title: "Incomplete Form",
        html: "Please fill out all fields before adding the menu item.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
      return;
    }

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

      await swalWithCrossfade.fire({
        title: "Menu Item Added",
        html: `"${name}" has been added to the menu.`,
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });

      handleMenuClose();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const onCancel = async (e) => {
    e.preventDefault();
    if (name.trim() || desc.trim() || price.trim()) {
      const { isConfirmed } = await swalWithCrossfade.fire({
        title: "Cancel Adding Item?",
        html: "You have unsaved changes. Are you sure you want to cancel?",
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel",
        cancelButtonText: "Continue Editing",
        width: 600,
        didOpen: () => {
          applySwalStyling();
          setTimeout(() => {
            const confirmButton = document.querySelector('.swal2-confirm');
            if (confirmButton) {
              confirmButton.style.backgroundColor = '#dd2e44';
              confirmButton.style.color = 'white';
              confirmButton.style.borderRadius = '15px';
              confirmButton.style.fontFamily = 'Montserrat';
              confirmButton.style.boxShadow = 'none';
              confirmButton.style.padding = '10px 24px';
              confirmButton.style.outline = 'none';
            }
            const cancelButton = document.querySelector('.swal2-cancel');
            if (cancelButton) {
              cancelButton.style.backgroundColor = '#89bd2e';
              cancelButton.style.color = 'white';
              cancelButton.style.borderRadius = '15px';
              cancelButton.style.fontFamily = 'Montserrat';
              cancelButton.style.boxShadow = 'none';
              cancelButton.style.padding = '10px 24px';
              cancelButton.style.outline = 'none';
            }
          }, 20);
        },
      });
      if (!isConfirmed) return;
      await swalWithCrossfade.fire({
        title: "Cancelled",
        html: "Adding menu item was cancelled.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
    }
    handleMenuClose();
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
        <button className="add-menu-submit-btn" onClick={onCancel}>
          CANCEL
        </button>
        <button className="add-menu-submit-btn" onClick={onSubmit}>
          ADD
        </button>
      </div>
    </div>
  );
}
