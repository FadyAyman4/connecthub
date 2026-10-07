import api from './api';
import { isLocalPost } from './postService';

const COMMENTS_KEY = 'localComments';

const getLocalComments = () => {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
  } catch (err) {
    return [];
  }
};

const saveLocalComments = (comments) => {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
};

export const getCommentsByPost = async (postId) => {
  if (isLocalPost(postId)) {
    return getLocalComments().filter(
      (c) => String(c.postId) === String(postId)
    );
  }
  const response = await api.get(`/comments/post/${postId}`);
  return response.data.comments;
};

export const createComment = async (commentData) => {
  if (isLocalPost(commentData.postId)) {
    const newComment = {
      id: Date.now(),
      body: commentData.body,
      postId: commentData.postId,
      userId: commentData.userId,
    };
    saveLocalComments([...getLocalComments(), newComment]);
    return newComment;
  }
  const response = await api.post('/comments/add', commentData);
  return response.data;
};

export const removeComment = async (id) => {
  if (getLocalComments().some((c) => String(c.id) === String(id))) {
    saveLocalComments(getLocalComments().filter((c) => String(c.id) !== String(id)));
    return { id, isDeleted: true };
  }
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};