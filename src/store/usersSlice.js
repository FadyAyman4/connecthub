import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { getLocalUsers } from '../services/authService';

const FOLLOWING_KEY = 'followingUsers';

const loadFollowing = () => {
  try {
    return JSON.parse(localStorage.getItem(FOLLOWING_KEY)) || [];
  } catch (err) {
    return [];
  }
};

export const fetchUserProfiles = createAsyncThunk(
  'users/fetchUserProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users?limit=0&select=username,image');
      const profiles = {};
      response.data.users.forEach((u) => {
        profiles[u.id] = { username: u.username, image: u.image };
      });
      getLocalUsers().forEach((u) => {
        profiles[u.id] = { username: u.username, image: u.image };
      });
      return profiles;
    } catch (err) {
      return rejectWithValue('Unable to load user profiles.');
    }
  }
);

const initialState = {
  following: loadFollowing(),
  profiles: {},
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleFollow: (state, action) => {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter((id) => id !== userId);
      } else {
        state.following.push(userId);
      }
      localStorage.setItem(FOLLOWING_KEY, JSON.stringify(state.following));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfiles.fulfilled, (state, action) => {
      state.profiles = { ...state.profiles, ...action.payload };
    });
  },
});

export const { toggleFollow } = usersSlice.actions;
export default usersSlice.reducer;