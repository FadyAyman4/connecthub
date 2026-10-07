import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from '../store/notificationsSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state) => state.notifications
  );

 useEffect(() => {
  if (notifications.length === 0) {
    dispatch(fetchNotifications());
  }
}, [dispatch, notifications.length]);




  useEffect(() => {
    document.title =
      unreadCount > 0 ? `(${unreadCount}) Notifications` : 'Notifications';
  }, [unreadCount]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (notifications.length === 0) return <p>No notifications</p>;

return (
  <div className="notifications-page">
    <div className="notifications-header">
      <h1>Notifications ({unreadCount} unread)</h1>
      {unreadCount > 0 && (
        <button onClick={() => dispatch(markAllAsRead())}>Mark all as read</button>
      )}
    </div>
    {notifications.map((n) => (
      <div
        key={n.id}
        className={`notification-item ${!n.read ? 'unread' : ''}`}
        onClick={() => dispatch(markAsRead(n.id))}
      >
        {!n.read && <span className="notification-dot" />}
        <span>{n.message}</span>
      </div>
    ))}
  </div>
);
};

export default Notifications;