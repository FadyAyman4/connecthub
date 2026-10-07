import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !token.startsWith('local-')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.response) {
      if (error.response.status === 401) {
        message = 'Your session has expired. Please log in again.';
      } else if (error.response.status === 404) {
        message = 'The requested item was not found.';
      } else if (error.response.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;