import { useState } from 'react';
import Modal from './Modal';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeExistingPost, toggleLikePost } from '../store/postsSlice';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.users.profiles[post.userId]);
  const commentCount = useSelector(
    (state) => state.comments.commentCounts[post.id] ?? 0
  );
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = user?.id === post.userId;
  const likes = post.reactions?.likes ?? 0;
  const username = post.username || profile?.username || `User ${post.userId}`;
  const avatar = profile?.image || `https://dummyjson.com/icon/${username}/64`;

  const handleDelete = () => {
    dispatch(removeExistingPost(post.id));
    setShowDeleteModal(false);
  };

  const handleLike = () => {
    dispatch(toggleLikePost(post));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <Link to={`/profile/${post.userId}`}>
          <img className="post-card-avatar" src={avatar} alt={username} width="40" height="40" />
        </Link>
        <div>
          <Link to={`/profile/${post.userId}`} className="post-card-author">
            {username}
          </Link>
          {post.createdAt && (
            <div className="post-card-date">{new Date(post.createdAt).toLocaleString()}</div>
          )}
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className="post-card-body">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </Link>

      {post.image && <img className="post-card-image" src={post.image} alt="Post" />}

      <div className="post-card-actions">
        <button onClick={handleLike}>{post.likedByMe ? 'Unlike' : 'Like'}</button>
        <span>{likes} likes</span>
        <button onClick={() => navigate(`/posts/${post.id}`)}>Comment</button>
        <span>{commentCount} comments</span>
        <button onClick={handleShare}>{copied ? 'Link copied!' : 'Share'}</button>
      </div>

      {isOwner && (
        <div className="post-card-owner-actions">
          <button onClick={() => navigate(`/edit-post/${post.id}`)}>Edit</button>
          <button className="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </button>
        </div>
      )}

      {showDeleteModal && (
        <Modal
          title="Delete post?"
          message="This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PostCard;