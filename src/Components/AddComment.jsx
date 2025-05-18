import React, { useState } from "react";

export default function AddComment({ handleAddComment }) {
  const [newComment, setNewComment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    await handleAddComment(newComment);
    setNewComment("");
  };

  return (
    <form onSubmit={onSubmit} className="add-comment-form">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your review here..."
        rows={4}
        style={{ width: "100%", marginTop: "1rem" }}
      />
      <button
        type="submit"
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#89bd2e",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "Montserrat",
        }}
      >
        Submit Review
      </button>
    </form>
  );
}
