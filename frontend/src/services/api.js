import axios from "axios";


// API Base URL
const API_URL = "https://mern-blog-b8ed.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to include token
api.interceptors.request.use(
  (config) => {
    // get token from localstorage
    const token = localStorage.getItem("token");
    if (token) {
      // if token exist, add to authorization headers
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token inviato:", token); // token Log for debugging
    }
    return config;
  },
  (error) => {
    // error handler
    return Promise.reject(error);
  }
);

// CRUD Operations

// Blog posts
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post("/blogPosts", postData, {headers: {'Content-Type': 'multipart/form-data'},});
export const updatePost = (id, postData) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Comments
export const getComments = (postId) => api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);
export const addComment = (postId, commentData) => api.post(`/blogPosts/${postId}/comments`, commentData).then((response) => response.data);
export const getComment = (postId, commentId) => api.get(`/blogPosts/${postId}/comments/${commentId}`).then((response) => response.data);
export const updateComment = (postId, commentId, commentData) => api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData).then((response) => response.data);
export const deleteComment = (postId, commentId) => api.delete(`/blogPosts/${postId}/comments/${commentId}`).then((response) => response.data);

// User
export const userLogin = async (credentials) => {
  try {
    // Login request
    const response = await api.post("/auth/login", credentials);
    // return data inside response
    return response.data;
  } catch (error) {
    console.error("Autentication failed:", error);
    throw error;
  }
};
export const registerUser = (userData) => api.post("/authors", userData);
export const getMe = () => api.get("/auth/me").then((response) => response.data);
export const getUserData = async () => {
  try {
    // get user data
    const response = await api.get('/auth/me');

    // return user data inside the response
    return response.data;

  } catch (err) {
    console.error('Fetch user data error:', err);
    throw err;
  }
};

export default api;
