import { useState, useEffect } from "react";
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
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';
import 'animate.css';
import { firebaseConfig } from "../firebaseConfig";
import AddComment from "./AddComment";
import Comment from "./Comment";

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

export default function RestoReviews({ resto, userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userType = sessionStorage.getItem("userType") || localStorage.getItem("userType");

  useEffect(() => {
    if (!resto?.id) {
      setComments([]);
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "comments"), where("restoId", "==", resto.id));
        const querySnapshot = await getDocs(q);
        const fetchedComments = [];

        const userCache = new Map();

        for (const docSnap of querySnapshot.docs) {
          const commentData = docSnap.data();
          let userName = commentData.userId;

          if (userCache.has(commentData.userId)) {
            userName = userCache.get(commentData.userId);
          } else {
            try {
              const userSnap = await getDocs(
                query(collection(db, "users"), where("__name__", "==", commentData.userId))
              );

              if (!userSnap.empty) {
                const userDoc = userSnap.docs[0].data();
                userName = `${userDoc.firstName || ""} ${userDoc.lastName || ""}`.trim();
                userCache.set(commentData.userId, userName);
              }
            } catch (userError) {
              console.warn("Failed to fetch user for comment:", userError);
            }
          }

          fetchedComments.push({
            id: docSnap.id,
            ...commentData,
            userName,
          });
        }

        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
      setLoading(false);
    };

    fetchComments();
  }, [resto?.id]);

  const handleAddComment = async (text) => {
    if (!userId) {
      alert("You must be logged in to add a comment.");
      return;
    }
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        restoId: resto.id,
        userId,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      const q = query(collection(db, "comments"), where("restoId", "==", resto.id));
      const querySnapshot = await getDocs(q);
      const fetchedComments = [];

      const userCache = new Map();

      for (const docSnap of querySnapshot.docs) {
        const commentData = docSnap.data();
        let userName = commentData.userId;

        if (userCache.has(commentData.userId)) {
          userName = userCache.get(commentData.userId);
        } else {
          const userSnap = await getDocs(
            query(collection(db, "users"), where("__name__", "==", commentData.userId))
          );

          if (!userSnap.empty) {
            const userDoc = userSnap.docs[0].data();
            userName = `${userDoc.firstName || ""} ${userDoc.lastName || ""}`.trim();
            userCache.set(commentData.userId, userName);
          }
        }

        fetchedComments.push({
          id: docSnap.id,
          ...commentData,
          userName,
        });
      }

      setComments(fetchedComments);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleDeleteReview = async (reviewId, reviewCreatorId) => {
    const isAdmin = userType === "WcjOVRmHYXKZHsMzAVY2";

    if (userId !== reviewCreatorId && !isAdmin) {
      swalWithCrossfade.fire({
        title: "Unauthorized",
        text: "You can only delete your own reviews.",
        confirmButtonText: "OK",
        didOpen: applySwalStyling,
      });
      return;
    }

    const { isConfirmed } = await swalWithCrossfade.fire({
      title: "Confirm Deletion",
      html: "Are you sure you want to delete this review?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      width: 600,
      didOpen: applySwalStyling,
    });

    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, "comments", reviewId));
      setComments((prev) => prev.filter((r) => r.id !== reviewId));
      swalWithCrossfade.fire({
        title: "Success",
        text: "Review deleted.",
        confirmButtonText: "OK",
        didOpen: applySwalStyling,
      });
    } catch (error) {
      swalWithCrossfade.fire({
        title: "Error",
        text: "Failed to delete review: " + error.message,
        confirmButtonText: "OK",
        didOpen: applySwalStyling,
      });
    }
  };

  const canDeleteComment = (comment) => {
    return (
      userId &&
      (comment.userId === userId ||
        userType === "WcjOVRmHYXKZHsMzAVY2")
    );
  };

  return (
    <div className="resto-container-white-part">
      <AddComment handleAddComment={handleAddComment} />

      <hr style={{ margin: "1.5rem 0" }} />
      <h2 className="resto-text-header" style={{ marginBottom: "25px" }}>
        Reviews
      </h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : comments.length === 0 ? (
        <div className="nothing-here">
          <img src="assets/nothing_here.png" />
        </div>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            canDelete={canDeleteComment(comment)}
            onDelete={handleDeleteReview}
          />
        ))
      )}
    </div>
  );
}
