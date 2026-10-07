import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import { logoutUser } from '../store/authSlice';
import { searchUsers } from '../services/userService';
import useDebounce from '../hooks/useDebounce';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useSelector((state) => state.notifications);

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearch = useDebounce(searchText, 300);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }
    const runSearch = async () => {
      try {
        const data = await searchUsers(debouncedSearch);
        setResults(data.slice(0, 6));
      } catch (err) {
        setResults([]);
      }
    };
    runSearch();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleSelectUser = (userId) => {
    setSearchText('');
    setResults([]);
    setShowDropdown(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <nav className="top-navbar">
      <Link to={isAuthenticated ? '/home' : '/login'} className="navbar-logo">
        <img src={logo} alt="ConnectHub" />
      </Link>

      {isAuthenticated ? (
        <div className="navbar-right">
        <div className="search-wrapper" ref={wrapperRef}>
  <button className="search-icon-btn" onClick={() => setShowDropdown((v) => !v)}>
    🔍
  </button>
  {showDropdown && (
    <div className="search-panel">
      <input
        type="text"
        placeholder="Search users..."
        autoFocus
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {searchText.trim() && (
        <div>
          {results.length === 0 ? (
            <div className="search-dropdown-empty">No users found</div>
          ) : (
            results.map((u) => (
              <div
                key={u.id}
                className="search-dropdown-item"
                onClick={() => handleSelectUser(u.id)}
              >
                <img src={u.image} alt={u.username} width="32" height="32" />
                <span>{u.username}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )}
</div>

          <Link to="/home">Home</Link>
          <Link to="/create-post">Create Post</Link>
          <Link to="/quotes">Quotes</Link>
          <Link to="/notifications">
            Notifications{unreadCount > 0 && ` (${unreadCount})`}
          </Link>
          <Link to={`/profile/${user.id}`}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="navbar-right">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;