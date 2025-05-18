import React from "react";

export default function Comment({
  comment,
  canDelete,
  onDelete,
}) {
  return (
    <div className="comment-container">
      <p className="comment">{comment.text}</p>
      <small className="user-comment">
        {comment.userName || comment.userId} –{" "}
        {comment.createdAt?.toDate
          ? comment.createdAt.toDate().toLocaleString()
          : ""}
      </small>

      {canDelete && (
        <img
          src="assets/gen_x_btn.png"
          className="comment-x-btn"
          alt="Delete"
          onClick={() => onDelete(comment.id, comment.userId)}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
}

