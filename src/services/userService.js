import api from './api';
import { getLocalUsers } from './authService';

const OVERRIDES_KEY = 'userOverrides';

const getOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDES_KEY)) || {};
  } catch (err) {
    return {};
  }
};

const saveOverride = (userId, data) => {
  const overrides = getOverrides();
  overrides[userId] = { ...overrides[userId], ...data };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
};

const applyOverride = (user) => {
  const override = getOverrides()[user.id];
  return override ? { ...user, ...override } : user;
};

export const getUserById = async (id) => {
  const localUser = getLocalUsers().find((u) => String(u.id) === String(id));
  if (localUser) {
    const { password, ...safeUser } = localUser;
    return applyOverride(safeUser);
  }
  const response = await api.get(`/users/${id}`);
  return applyOverride(response.data);
};

export const searchUsers = async (query) => {
  const q = query.toLowerCase();
  const localMatches = getLocalUsers()
    .filter((u) => u.username.toLowerCase().includes(q))
    .map(({ password, ...safeUser }) => applyOverride(safeUser));
  const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  return [...localMatches, ...response.data.users.map(applyOverride)];
};

export const updateUserProfile = async (id, { bio, image, username }) => {
  const data = {};
  if (bio !== undefined) data.bio = bio;
  if (image !== undefined) data.image = image;
  if (username !== undefined && username.trim()) data.username = username.trim();
  saveOverride(id, data);
  return data;
};