import { useEffect, useState ,useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPost, toggleLikePost } from '../store/postsSlice';

import {
  fetchComments,
  addNewComment,
  removeExistingComment,
} from '../store/commentsSlice';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedPost: post, loading, error } = useSelector((state) => state.posts);
  const { comments, loading: commentsLoading, error: commentsError } = useSelector(
    (state) => state.comments
  );

  const [actionError, setActionError] = useState('');

  useEffect(() => {
    dispatch(fetchPost(id));
  }, [id, dispatch]);

useEffect(() => {
  dispatch(fetchComments(id));
}, [id, dispatch]);

  const handleLike = () => {
    dispatch(toggleLikePost(post));
  };

const handleAddComment = useCallback(
  async (text) => {
    setActionError('');
    const result = await dispatch(addNewComment({ text, postId: Number(id), user }));
    if (!addNewComment.fulfilled.match(result)) {
      setActionError(result.payload);
    }
  },
  [dispatch, id, user]
);

const handleDeleteComment = useCallback(
  async (comment) => {
    setActionError('');
    const result = await dispatch(removeExistingComment(comment));
    if (!removeExistingComment.fulfilled.match(result)) {
      setActionError(result.payload);
    }
  },
  [dispatch]
);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found</p>;

return (
  <div className="post-details-page">
    <div className="post-card">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {post.image && <img className="post-card-image" src={post.image} alt="Post" />}
      <div className="post-card-actions">
        <button onClick={handleLike}>{post.likedByMe ? 'Unlike' : 'Like'}</button>
        <span>{post.reactions?.likes ?? 0} likes</span>
      </div>
    </div>

    <div className="comments-section">
      <h2>Comments ({comments.length})</h2>
      {user && <CommentForm onSubmit={handleAddComment} />}
      {actionError && <p style={{ color: 'red' }}>{actionError}</p>}

      {commentsLoading && <p>Loading comments...</p>}
      {commentsError && <p style={{ color: 'red' }}>{commentsError}</p>}
      {!commentsLoading && !commentsError && (
        <CommentList
          comments={comments}
          currentUserId={user?.id}
          onDelete={handleDeleteComment}
        />
      )}
    </div>
  </div>
);
};

export default PostDetails;