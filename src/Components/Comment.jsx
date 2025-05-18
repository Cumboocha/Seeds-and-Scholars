import React from "react";

export default function Comment({
  comment,
  canDelete,
  onDelete,
}) {
  return (
    <div
      className="comment-item"
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}>{comment.text}</p>
      <small style={{ color: "#666" }}>
        {comment.userName || comment.userId} –{" "}
        {comment.createdAt?.toDate
          ? comment.createdAt.toDate().toLocaleString()
          : ""}
      </small>

      {canDelete && (
        <button
          onClick={() => onDelete(comment.id, comment.userId)}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "2rem",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.25rem 0.5rem",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

