import api from './api';

const messages = [
  'liked your post.',
  'commented on your post.',
  'started following you.',
];

export const getNotifications = async () => {
  const response = await api.get('/users?limit=6&select=firstName,image');
  return response.data.users.map((user, index) => ({
    id: user.id,
    message: `${user.firstName} ${messages[index % messages.length]}`,
    read: index >= 4,
  }));
};