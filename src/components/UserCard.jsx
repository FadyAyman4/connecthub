import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`} className="user-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src={user.image} alt={user.username} width="50" height="50" />
      <div>
        <h3>{user.username}</h3>
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
    </Link>
  );
};

export default UserCard;