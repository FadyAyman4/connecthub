import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPostById } from '../services/postService';
import { editExistingPost } from '../store/postsSlice';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await getPostById(id);
        if (post.userId !== user?.id) {
          setAccessDenied(true);
        } else {
          setContent(post.body);
        }
      } catch (err) {
        setError('Unable to load this post.');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, user]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!content.trim()) {
    setError('Post content is required.');
    return;
  }
  const result = await dispatch(
    editExistingPost({ id: Number(id), postData: { body: content } })
  );
  if (editExistingPost.fulfilled.match(result)) {
    navigate(`/posts/${id}`);
  } else {
    setError(result.payload || 'Failed to update post.');
  }
};

  if (loading) return <p>Loading...</p>;
  if (accessDenied) return <p style={{ color: 'red' }}>Access denied — this isn't your post.</p>;

  return (
    <div className="edit-post-page">
    <form onSubmit={handleSubmit}>
      <h1>Edit Post</h1>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Save Changes</button>
    </form>
    </div>
  );
};

export default EditPost;