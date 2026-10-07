const ProfileHeader = ({
  profileUser,
  bio,
  followersCount,
  followingCount,
  isOwnProfile,
  isFollowing,
  onToggleFollow,
  onEditProfile,
}) => {
  return (
    <div className="profile-header">
      <img src={profileUser.image} alt={profileUser.username} width="100" height="100" />
      <h1>{profileUser.username}</h1>
      <p>{bio}</p>
      <p className="profile-stats">
        <strong>{followersCount}</strong> followers · <strong>{followingCount}</strong> following
      </p>
      {isOwnProfile ? (
        <button onClick={onEditProfile}>Edit Profile</button>
      ) : (
        <button onClick={onToggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
      )}
    </div>
  );
};

export default ProfileHeader;