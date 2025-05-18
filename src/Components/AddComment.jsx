import React, { useState } from "react";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

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

export default function AddComment({ handleAddComment, loading }) {
  const [comment, setComment] = useState("");

  const handleAdd = async () => {
    if (!comment.trim()) {
      await swalWithCrossfade.fire({
        title: "Empty Comment",
        html: "Please write a comment before submitting.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
      return;
    }
    if (comment.trim().length < 10) {
      await swalWithCrossfade.fire({
        title: "Comment Too Short",
        html: "Comment must be at least 10 characters long.",
        confirmButtonText: "OK",
        width: 600,
        didOpen: applySwalStyling,
      });
      return;
    }
    await handleAddComment(comment);
    setComment("");
  };

  return (
    <div className="add-comment-body">
      <textarea
        placeholder="Write a review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
        className="add-comment-textarea"
      />
      <img
        src="assets/send.svg"
        alt="Send"
        className="add-comment-send-btn"
        onClick={loading ? undefined : handleAdd}
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      />
    </div>
  );
}

