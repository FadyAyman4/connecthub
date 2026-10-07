import api from './api';

const POSTS_KEY = 'localPosts';

const getLocalPosts = () => {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
  } catch (err) {
    return [];
  }
};

const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (err) {
    throw new Error(
      'Browser storage is full. Delete some posts or use a smaller image.'
    );
  }
};

const findLocalPost = (id) =>
  getLocalPosts().find((p) => String(p.id) === String(id));

export const getAllPosts = async () => {
  const response = await api.get('/posts?limit=0');
  const localPosts = [...getLocalPosts()].reverse();
  return [...localPosts, ...response.data.posts].map(applyLikeState);
};


const LIKES_KEY = 'postLikeState';

const getLikeState = () => {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY)) || {};
  } catch (err) {
    return {};
  }
};

const saveLikeState = (state) => {
  localStorage.setItem(LIKES_KEY, JSON.stringify(state));
};

const applyLikeState = (post) => {
  const override = getLikeState()[post.id];
  if (!override) return post;
  return {
    ...post,
    reactions: { ...post.reactions, likes: override.likes },
    likedByMe: override.likedByMe,
  };
};






export const getPostById = async (id) => {
  const localPost = findLocalPost(id);
  if (localPost) return applyLikeState(localPost);
  const response = await api.get(`/posts/${id}`);
  return applyLikeState(response.data);
};

export const createPost = async ({ title, body, image, userId, username }) => {
  const newPost = {
    id: Date.now(),
    title,
    body,
    image,
    userId,
    username,
    createdAt: new Date().toISOString(),
    reactions: { likes: 0, dislikes: 0 },
    local: true,
  };
  saveLocalPosts([...getLocalPosts(), newPost]);
  return newPost;
};

export const editPost = async (id, postData) => {
  if (findLocalPost(id)) {
    const posts = getLocalPosts().map((p) =>
      String(p.id) === String(id) ? { ...p, ...postData } : p
    );
    saveLocalPosts(posts);
    return findLocalPost(id);
  }
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

export const removePost = async (id) => {
  if (findLocalPost(id)) {
    saveLocalPosts(getLocalPosts().filter((p) => String(p.id) !== String(id)));
    return { id, isDeleted: true };
  }
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const updateLikes = async (id, likes, likedByMe) => {
  const state = getLikeState();
  state[id] = { likes, likedByMe };
  saveLikeState(state);

  if (findLocalPost(id)) {
    const posts = getLocalPosts().map((p) =>
      String(p.id) === String(id)
        ? { ...p, reactions: { ...p.reactions, likes } }
        : p
    );
    saveLocalPosts(posts);
    return applyLikeState(findLocalPost(id));
  }
  const response = await api.put(`/posts/${id}`, { reactions: { likes } });
  return applyLikeState({ ...response.data, id });
};

export const isLocalPost = (id) => {
  try {
    const posts = JSON.parse(localStorage.getItem('localPosts')) || [];
    return posts.some((p) => String(p.id) === String(id));
  } catch (err) {
    return false;
  }
};