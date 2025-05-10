import AddComment from "./AddComment";
import Comment from "./Comment";
import { useState } from "react";

export default function RestiReviews() {
  const [comments, setComments] = useState([]);

  function handleAddComment() {
    setComments([
        ...comments,
        <Comment />
    ])
  }

  return (
      <div className="resto-container-white-part">
        <AddComment handleAddComment={handleAddComment}/>
        <hr/>
        <h2 className="resto-text-header">Reviews</h2>
        {comments.length === 0 ? 
        <div className="nothing-here"> <img src="assets/nothing_here.png" /> </div>:
        comments.map((comments, index) => <div key={index}>{comments}</div>)
        }
      
    </div>
  );
}
