import api from './api';

const USERS_KEY = 'registeredUsers';

export const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (err) {
    return [];
  }
};

export const registerUser = async ({ username, email, password, image }) => {
  const users = getLocalUsers();
  const emailTaken = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (emailTaken) {
    throw new Error('This email is already registered.');
  }
  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    image: image || `https://dummyjson.com/icon/${username}/128`,
    company: { title: 'Member', name: 'ConnectHub' },
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return newUser;
};

export const loginUser = async (identifier, password) => {
  const localUser = getLocalUsers().find(
    (u) =>
      u.email.toLowerCase() === identifier.toLowerCase() &&
      u.password === password
  );
  if (localUser) {
    const { password: savedPassword, ...safeUser } = localUser;
    return { ...safeUser, accessToken: `local-${localUser.id}` };
  }
  const response = await api.post('/auth/login', {
    username: identifier,
    password,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (token && token.startsWith('local-')) {
    const localUser = getLocalUsers().find((u) => `local-${u.id}` === token);
    if (!localUser) throw new Error('Session expired');
    const { password, ...safeUser } = localUser;
    return safeUser;
  }
  const response = await api.get('/auth/me');
  return response.data;
};