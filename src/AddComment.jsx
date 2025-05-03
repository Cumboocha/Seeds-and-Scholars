export default function AddComment({handleAddComment}) {
  return (
    <div className="add-comment-body">
      <textarea placeholder="Write a review" />
      <img src="assets/send.svg" onClick={handleAddComment}/>
    </div>
  );
}
