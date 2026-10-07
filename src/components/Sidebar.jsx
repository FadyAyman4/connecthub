import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../services/userService';
import { updateUserInfo } from '../store/authSlice';
import { fetchUserProfiles, toggleFollow } from '../store/usersSlice';
import EditProfileModal from './EditProfileModal';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profiles, following } = useSelector((state) => state.users);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user && Object.keys(profiles).length === 0) {
      dispatch(fetchUserProfiles());
    }
  }, [user, profiles, dispatch]);

  const suggested = useMemo(() => {
    if (!user) return [];
    return Object.entries(profiles)
      .filter(([id]) => Number(id) !== user.id && !following.includes(Number(id)))
      .slice(0, 4)
      .map(([id, data]) => ({ id: Number(id), ...data }));
  }, [profiles, following, user]);

  if (!user) return null;

  const bio =
    user.bio || `${user.company?.title ?? 'Member'} at ${user.company?.name ?? 'ConnectHub'}`;

 const handleSaveProfile = async ({ username, bio: newBio, image }) => {
  await updateUserProfile(user.id, { username, bio: newBio, image });
  dispatch(updateUserInfo({ username, bio: newBio, image }));
  setShowEditModal(false);
};
  return (
    <aside className="app-sidebar">
      <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={user.image}
          alt={user.username}
          width="70"
          height="70"
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
        <h3>{user.username}</h3>
      </Link>
      <p>{bio}</p>
      <button onClick={() => setShowEditModal(true)}>Edit Profile</button>

      {suggested.length > 0 && (
        <div className="suggested-card">
          <h4>Suggested for you</h4>
          {suggested.map((s) => (
            <div key={s.id} className="suggested-user">
              <img src={s.image} alt={s.username} width="36" height="36" />
              <div className="suggested-user-info">
                <Link to={`/profile/${s.id}`}>{s.username}</Link>
              </div>
              <button onClick={() => dispatch(toggleFollow(s.id))}>Follow</button>
            </div>
          ))}
        </div>
      )}

      {showEditModal && (
       <EditProfileModal
  currentUsername={user.username}
  currentBio={user.bio}
  currentImage={user.image}
  onSave={handleSaveProfile}
  onCancel={() => setShowEditModal(false)}
/>
      )}
    </aside>
  );
};

export default Sidebar;