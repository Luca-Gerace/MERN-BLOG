import axios from "axios";

// API Base URL
const API_URL = "http://localhost:5005/api";
const api = axios.create({
  baseURL: API_URL,
});

// CRUD Operations
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) => api.post("/blogPosts", postData, {headers: {'Content-Type': 'multipart/form-data'}});
export const updatePost = (id, postData) =>
  api.put(`/blogPosts/${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

export default api;
