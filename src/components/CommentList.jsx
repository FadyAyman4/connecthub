const CommentList = ({ comments, currentUserId, onDelete }) => {
  if (comments.length === 0) return <p>No comments yet</p>;

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-item-body">
            <strong>{comment.user?.username}</strong>
            <p>{comment.body}</p>
          </div>
          {comment.user?.id === currentUserId && (
            <button onClick={() => onDelete(comment)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;