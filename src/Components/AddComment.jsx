export default function AddComment({ handleAddComment }) {
  const userId = sessionStorage.getItem("userId") 

  return (
    <div className="add-comment-body">
      <textarea placeholder="Write a review..." />
      <img src="assets/send.svg" onClick={() => handleAddComment(userId)} />
    </div>
  );
}
