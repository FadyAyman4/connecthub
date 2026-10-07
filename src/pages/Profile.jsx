import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById, updateUserProfile } from '../services/userService';
import { fetchPosts } from '../store/postsSlice';
import { toggleFollow } from '../store/usersSlice';
import { updateUserInfo } from '../store/authSlice';
import PostCard from '../components/PostCard';
import ProfileHeader from '../components/ProfileHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { posts, loading: postsLoading, error: postsError } = useSelector(
    (state) => state.posts
  );
  const { following } = useSelector((state) => state.users);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserById(id);
        setProfileUser(data);
      } catch (err) {
        setError('Unable to load this profile.');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  const userPosts = useMemo(
    () => posts.filter((post) => post.userId === Number(id)),
    [posts, id]
  );

  const handleSaveProfile = async ({ username, bio, image }) => {
    await updateUserProfile(profileUser.id, { username, bio, image });
    setProfileUser({ ...profileUser, username, bio, image });
    dispatch(updateUserInfo({ username, bio, image }));
    setShowEditModal(false);
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!profileUser) return <p>User not found</p>;

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFollowing = following.includes(profileUser.id);
  const bio =
    profileUser.bio ||
    `${profileUser.company?.title ?? 'Member'} at ${profileUser.company?.name ?? 'ConnectHub'}`;
  const baseFollowers = (profileUser.id * 37) % 500 + 20;
  const baseFollowing = (profileUser.id * 13) % 200 + 10;
  const followersCount = baseFollowers + (isFollowing ? 1 : 0);
  const followingCount = baseFollowing + (isOwnProfile ? following.length : 0);

  return (
    <div className="feed-container">
      <ProfileHeader
        profileUser={profileUser}
        bio={bio}
        followersCount={followersCount}
        followingCount={followingCount}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onToggleFollow={() => dispatch(toggleFollow(profileUser.id))}
        onEditProfile={() => setShowEditModal(true)}
      />

      {showEditModal && (
        <EditProfileModal
          currentUsername={profileUser.username}
          currentBio={profileUser.bio}
          currentImage={profileUser.image}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      <h2 className="profile-posts-heading">Posts</h2>
      {postsLoading && <LoadingSpinner text="Loading posts..." />}
      {postsError && <ErrorMessage message={postsError} />}
      {!postsLoading && !postsError && userPosts.length === 0 && (
        <p>No posts available</p>
      )}
      {userPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Profile;