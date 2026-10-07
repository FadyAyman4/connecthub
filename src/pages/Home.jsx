import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/postsSlice';
import { fetchUserProfiles } from '../store/usersSlice';
import { fetchCommentCounts } from '../store/commentsSlice';
import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { profiles } = useSelector((state) => state.users);
  const { commentCounts } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchPosts());
    if (Object.keys(profiles).length === 0) {
      dispatch(fetchUserProfiles());
    }
    if (Object.keys(commentCounts).length === 0) {
      dispatch(fetchCommentCounts());
    }
  }, [dispatch, profiles, commentCounts]);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchPosts())} />;
  if (posts.length === 0) return <p>No posts available</p>;

  return (
    <div className="feed-container">
      <h1>Home Feed</h1>
      <CreatePostForm />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;