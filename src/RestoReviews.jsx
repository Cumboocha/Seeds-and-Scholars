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
        <br />
        <hr/>
        {comments.length === 0 ? 
        <div className="nothing-here"> <img src="assets/nothing_here.png" /> </div>:
        comments.map((comments, index) => <div key={index}>{comments}</div>)
        }
      
    </div>
  );
}
