import { useState, useEffect } from "react";
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
  getDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const swalWithCrossfade = Swal.mixin({
  showClass: {
    popup: 'animate__animated animate__fadeIn'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut'
  }
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

export default function RestoProfile({ resto, onClose, showPopup, onUnfavorite }) {
  const userId = sessionStorage.getItem("userId");
  const userType =
    sessionStorage.getItem("userType") || localStorage.getItem("userType");
  const [restoProfileScreen, setRestoProfileScreen] = useState("about");
  const [favorite, setFavorite] = useState("unfavorited");
  const [isUnfavorited, setIsUnfavorited] = useState(false);

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (userId && resto?.id) {
        const favQuery = query(
          collection(db, "favorites"),
          where("userId", "==", userId),
          where("restoId", "==", resto.id)
        );
        const favSnapshot = await getDocs(favQuery);
        if (!favSnapshot.empty) {
          setFavorite("favorited");
        } else {
          setFavorite("unfavorited");
        }
      }
    };
    checkIfFavorited();
  }, [userId, resto?.id]);

  useEffect(() => {
    if (isUnfavorited && onUnfavorite && resto?.id) {
      onUnfavorite(resto.id);
      setIsUnfavorited(false); 
    }
    
  }, [isUnfavorited]);

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
        swalWithCrossfade.fire({
          title: "Error",
          text: "Failed to add favorite: " + error.message,
          confirmButtonText: "OK",
          didOpen: () => applySwalStyling()
        });
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
        setIsUnfavorited(true);
      } catch (error) {
        swalWithCrossfade.fire({
          title: "Error",
          text: "Failed to remove favorite: " + error.message,
          confirmButtonText: "OK",
          didOpen: () => applySwalStyling()
        });
      }
    }
  };

  const handleAccept = async () => {
    if (!resto?.id) return;
    
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Acceptance",
      html: "Are you sure you want to accept this establishment?",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: () => applySwalStyling()
    });

    if (isConfirmed) {
      try {
        await updateDoc(doc(db, "restaurants", resto.id), { isAccepted: true });

        await swalWithCrossfade.fire({
          title: "Accepted",
          text: "Establishment was accepted.",
          confirmButtonText: "OK",
          width: 600,
          didOpen: applySwalStyling,
        });

        showPopup?.("Establishment accepted!");
        if (onClose) onClose();
      } catch (error) {
        swalWithCrossfade.fire({
          title: "Error",
          text: "Failed to accept establishment: " + error.message,
          confirmButtonText: "OK",
          didOpen: () => applySwalStyling()
        });
      }
    } else {
      await swalWithCrossfade.fire({
        title: "Cancelled",
        text: "Restaurant Acceptance was cancelled.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
    }
  };

  const handleDecline = async () => {
    if (!resto?.id) return;
    
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Decline",
      html: "Are you sure you want to decline this establishment?",
      showCancelButton: true,
      confirmButtonText: "Decline",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: () => applySwalStyling()
    });

    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "restaurants", resto.id));

        if (resto.createdBy) {
          const userRef = doc(db, "users", resto.createdBy);
          await updateDoc(userRef, { userType: "SXduDAM4N2f9FN3bS3vZ" });
        }

        await swalWithCrossfade.fire({
          title: "Declined",
          text: "Establishment was declined.",
          confirmButtonText: "OK",
          width: 600,
          didOpen: applySwalStyling,
        });

        showPopup?.("Establishment declined.");
        if (onClose) onClose();
      } catch (error) {
        swalWithCrossfade.fire({
          title: "Error",
          text: "Failed to decline establishment: " + error.message,
          confirmButtonText: "OK",
          didOpen: () => applySwalStyling()
        });
      }
    } else {
      await swalWithCrossfade.fire({
        title: "Cancelled",
        text: "Restaurant Decline was cancelled.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
    }
  };

  const handleDelete = async () => {
    if (!resto?.id) return;
    
    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Deletion",
      html: "Are you sure you want to delete this restaurant?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: () => applySwalStyling()
    });

    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, "restaurants", resto.id));

      if (resto.createdBy) {
        const userRef = doc(db, "users", resto.createdBy);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          await updateDoc(userRef, { userType: "SXduDAM4N2f9FN3bS3vZ" });
        }
      }

      await swalWithCrossfade.fire({
        title: "Success",
        text: "Restaurant deleted successfully.",
        confirmButtonText: "OK",
        didOpen: () => {
          applySwalStyling();
          const confirmButton = document.querySelector('.swal2-confirm');
          if (confirmButton) confirmButton.style.backgroundColor = '#3b86b6';
        },
        willClose: () => {
          window.location.reload();
        }
      });
    } catch (error) {
      swalWithCrossfade.fire({
        title: "Error",
        text: "Failed to delete restaurant: " + error.message,
        confirmButtonText: "OK",
        didOpen: () => applySwalStyling()
      });
    }
  };

  if (!resto) return <div className="spinner"></div>;

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
                {userType !== "WcjOVRmHYXKZHsMzAVY2" && (
                  favorite === "unfavorited" ? (
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
                  )
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
              window.location.reload();
            }
          }}
          alt="Close"
        />
      </div>
    </>
  );
}
