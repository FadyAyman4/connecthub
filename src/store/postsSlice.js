import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  removePost,
  updateLikes,
} from '../services/postService';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPosts();
    } catch (err) {
      return rejectWithValue('Unable to load posts. Please try again.');
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id, { rejectWithValue }) => {
    try {
      return await getPostById(id);
    } catch (err) {
      return rejectWithValue('Unable to load this post.');
    }
  }
);

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (postData, { rejectWithValue }) => {
    try {
      return await createPost(postData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create post.');
    }
  }
);

export const editExistingPost = createAsyncThunk(
  'posts/editExistingPost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const updated = await editPost(id, postData);
      return { id, ...postData, ...updated };
    } catch (err) {
      return rejectWithValue('Failed to update post.');
    }
  }
);

export const removeExistingPost = createAsyncThunk(
  'posts/removeExistingPost',
  async (id, { rejectWithValue }) => {
    try {
      await removePost(id);
      return id;
    } catch (err) {
      return rejectWithValue('Failed to delete post.');
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLikePost',
  async (post, { rejectWithValue }) => {
    const currentLikes = post.reactions?.likes ?? 0;
    const likedByMe = !post.likedByMe;
    const likes = likedByMe ? currentLikes + 1 : currentLikes - 1;
    try {
      await updateLikes(post.id, likes, likedByMe);
      return { id: post.id, likes, likedByMe };
    } catch (err) {
      return rejectWithValue('Failed to update like.');
    }
  }
);
const initialState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      .addCase(editExistingPost.fulfilled, (state, action) => {
  const index = state.posts.findIndex((p) => p.id === action.payload.id);
  if (index !== -1) {
    state.posts[index] = { ...state.posts[index], ...action.payload };
  }
  if (state.selectedPost?.id === action.payload.id) {
    state.selectedPost = { ...state.selectedPost, ...action.payload };
  }
})

      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPost = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
       })

      .addCase(removeExistingPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      })

.addCase(toggleLikePost.fulfilled, (state, action) => {
  const post = state.posts.find((p) => p.id === action.payload.id);
  if (post) {
    post.reactions.likes = action.payload.likes;
    post.likedByMe = action.payload.likedByMe;
  }
  if (state.selectedPost?.id === action.payload.id) {
    state.selectedPost.reactions.likes = action.payload.likes;
    state.selectedPost.likedByMe = action.payload.likedByMe;
  }
});
 },
});

export default postsSlice.reducer;