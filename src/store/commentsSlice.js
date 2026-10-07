import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import {
  getCommentsByPost,
  createComment,
  removeComment,
} from '../services/commentService';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      return await getCommentsByPost(postId);
    } catch (err) {
      return rejectWithValue('Unable to load comments.');
    }
  }
);

export const fetchCommentCounts = createAsyncThunk(
  'comments/fetchCommentCounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/comments?limit=0');
      const counts = {};
      response.data.comments.forEach((c) => {
        counts[c.postId] = (counts[c.postId] || 0) + 1;
      });
      return counts;
    } catch (err) {
      return rejectWithValue('Unable to load comment counts.');
    }
  }
);

export const addNewComment = createAsyncThunk(
  'comments/addNewComment',
  async ({ text, postId, user }, { rejectWithValue }) => {
    try {
      const created = await createComment({
        body: text,
        postId,
        userId: user.id,
      });
     return {
  ...created,
  postId,
  user: { id: user.id, username: user.username },
};
    } catch (err) {
      return rejectWithValue('Failed to add comment.');
    }
  }
);

export const removeExistingComment = createAsyncThunk(
  'comments/removeExistingComment',
  async (comment, { rejectWithValue }) => {
    try {
      if (!comment.local) {
        await removeComment(comment.id);
      }
      return { id: comment.id, postId: comment.postId };
    } catch (err) {
      return rejectWithValue('Failed to delete comment.');
    }
  }
);

const initialState = {
  comments: [],
  commentCounts: {},
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCommentCounts.fulfilled, (state, action) => {
        state.commentCounts = { ...state.commentCounts, ...action.payload };
      })

      .addCase(addNewComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        const postId = action.payload.postId;
        state.commentCounts[postId] = (state.commentCounts[postId] || 0) + 1;
      })

      .addCase(removeExistingComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload.id);
        const postId = action.payload.postId;
        if (state.commentCounts[postId] > 0) {
          state.commentCounts[postId] -= 1;
        }
      });
  },
});

export default commentsSlice.reducer;