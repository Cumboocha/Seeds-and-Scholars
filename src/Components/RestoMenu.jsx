import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import MenuItem from "./MenuItem";
import AddMenuItem from "./AddMenuItem"; 
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";
import { firebaseConfig } from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const swalWithCrossfade = Swal.mixin({
  showClass: { popup: "animate__animated animate__fadeIn" },
  hideClass: { popup: "animate__animated animate__fadeOut" },
});

const applySwalStyling = () => {
  setTimeout(() => {
    const confirmButton = document.querySelector(".swal2-confirm");
    if (confirmButton) {
      confirmButton.style.backgroundColor = "#89bd2e";
      confirmButton.style.color = "white";
      confirmButton.style.borderRadius = "15px";
      confirmButton.style.fontFamily = "Montserrat";
      confirmButton.style.boxShadow = "none";
      confirmButton.style.padding = "10px 24px";
      confirmButton.style.outline = "none";
    }

    const cancelButton = document.querySelector(".swal2-cancel");
    if (cancelButton) {
      cancelButton.style.backgroundColor = "#dd2e44";
      cancelButton.style.color = "white";
      cancelButton.style.borderRadius = "15px";
      cancelButton.style.fontFamily = "Montserrat";
      cancelButton.style.boxShadow = "none";
      cancelButton.style.padding = "10px 24px";
      cancelButton.style.outline = "none";
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

const PAGE_SIZE = 5;

export default function RestoMenu({ resto }) {
  const [menuItems, setMenuItems] = useState([]);
  const [menuScreen, setMenuScreen] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const userId = sessionStorage.getItem("userId");
  const userType = sessionStorage.getItem("userType") || localStorage.getItem("userType");

  useEffect(() => {
    if (!resto?.id) {
      setMenuItems([]);
      setIsOwner(false);
      return;
    }

    setIsOwner(resto.createdBy === userId);

    const q = query(collection(db, "menu"), where("restoId", "==", resto.id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMenu = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMenuItems(fetchedMenu);
      setCurrentPage(1); 
    }, (error) => {
      console.error("Error with onSnapshot:", error);
    });

    return () => unsubscribe();
  }, [resto?.id, userId]);

  const handleMenuScreenChange = () => setMenuScreen("add-item");
  const handleMenuClose = () => setMenuScreen(null);

  const handleMenuAdd = () => {
    handleMenuClose();
  };
  
  const handleDeleteMenuItem = async (menuItemId) => {
    const { isConfirmed } = await swalWithCrossfade.fire({
      html: "Are you sure you want to delete this menu item?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: applySwalStyling,
    });

    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "menu", menuItemId));
        await swalWithCrossfade.fire({
          title: "Deleted",
          text: "Menu item deleted successfully.",
          confirmButtonText: "OK",
          width: 600,
          didOpen: applySwalStyling,
        });
      } catch (error) {
        swalWithCrossfade.fire({
          text: "Failed to delete menu item: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
          didOpen: applySwalStyling,
        });
      }
    } else {
      await swalWithCrossfade.fire({
        title: "Cancelled",
        text: "Deletion was cancelled.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(menuItems.length / PAGE_SIZE));
  const paginatedMenuItems = menuItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="resto-container-white-part">
      {isOwner && (
        <div className="add-item-container" onClick={handleMenuScreenChange}>
          <p> + </p>
        </div>
      )}
      {isOwner && <hr />}
      <h2 className="resto-text-header" style={{ marginTop: "25px" }}>
        Menu
      </h2>

      {menuItems.length === 0 ? (
        <div className="nothing-here">
          <img src="assets/nothing_here.png" alt="Nothing here" />
        </div>
      ) : (
        <>
          {paginatedMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              userId={userId}
              userType={userType}
              onDelete={handleDeleteMenuItem}
            />
          ))}
          <div className="pagination-controls" style={{ marginTop: 16 }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              &lt;
            </button>
            <span style={{ margin: "0 8px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              &gt;
            </button>
          </div>
          <div className="menu-list-summary" style={{ marginTop: 12, textAlign: "center" }}>
            <span className="results-list">
              Showing {paginatedMenuItems.length} result
              {paginatedMenuItems.length !== 1 && "s"}
              {" (Page "}{currentPage} of {totalPages}{")"}
            </span>
          </div>
        </>
      )}

      {isOwner && menuScreen === "add-item" && (
        <AddMenuItem
          userId={userId}
          restoId={resto.id}
          handleMenuClose={handleMenuClose}
          handleMenuAdd={handleMenuAdd}
        />
      )}
    </div>
  );
}
