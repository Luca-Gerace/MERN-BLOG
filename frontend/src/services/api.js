import axios from "axios";


// API Base URL
const API_URL = "https://mern-blog-b8ed.onrender.com/api" || "http://localhost:5005/api";
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
export const createPost = (postData) => api.post("/blogPosts", postData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updatePost = (id, postData) => api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Comments
export const getComments = (id) => api.get(`/blogPosts/${id}/comments`).then((response) => response.data);
export const addComment = (id, commentData) => api.post(`/blogPosts/${id}/comments`, commentData).then((response) => response.data);
export const getComment = (id, commentId) => api.get(`/blogPosts/${id}/comments/${commentId}`).then((response) => response.data);
export const updateComment = (id, commentId, commentData) => api.put(`/blogPosts/${id}/comments/${commentId}`, commentData).then((response) => response.data);
export const deleteComment = (id, commentId) => api.delete(`/blogPosts/${id}/comments/${commentId}`).then((response) => response.data);

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
