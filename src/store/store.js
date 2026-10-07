import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postsReducer from './postsSlice';
import commentsReducer from './commentsSlice';
import usersReducer from './usersSlice';
import notificationsReducer from './notificationsSlice';
import quotesReducer from './quotesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    quotes: quotesReducer,
  },
});