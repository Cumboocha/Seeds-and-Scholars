import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

const db = getFirestore();

const swalWithCrossfade = Swal.mixin({
  showClass: { popup: 'animate__animated animate__fadeIn' },
  hideClass: { popup: 'animate__animated animate__fadeOut' },
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

export default function MenuItem({ item, userId, userType, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userType === "WcjOVRmHYXKZHsMzAVY2";
  const canDelete = userId === item.createdBy || isAdmin;

  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Deletion",
      html: `Are you sure you want to delete "${item.name}" from the menu?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: applySwalStyling,
    });

    if (!isConfirmed) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "menu", item.id));
      if (onDelete) onDelete(item.id);
      swalWithCrossfade.fire({
        title: "Deleted!",
        text: "Menu item deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        didOpen: applySwalStyling,
      });
    } catch (error) {
      swalWithCrossfade.fire({
        title: "Error",
        text: "Failed to delete menu item: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
        didOpen: applySwalStyling,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="menu-item">
      <div className="menu-item-img">
        <img src="assets/menu_item_default.png" alt={item.name} />
      </div>

      <div className="menu-item-info">
        <h1 className="menu-item-name">{item.name}</h1>
        <p className="menu-item-desc">{item.description}</p>
        <p className="menu-item-price">{item.price}</p>
      </div>

      {canDelete && (
        <div
          className="menu-x-btn-wrapper"
          onClick={handleDeleteClick}
          style={{ cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.5 : 1 }}
          title="Delete Menu Item"
        >
          <img src="assets/gen_x_btn.png" className="menu-x-btn" alt="Delete" />
        </div>
      )}
    </div>
  );
}
