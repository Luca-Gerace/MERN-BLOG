import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";

export default function CreatePost() {
  // Hooks - new post
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    cover: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });

  // Hook - navigation
  const navigate = useNavigate();

  // Form Handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST to /blogPosts
      await createPost(post);
      // Go back in Home
      navigate("/");
    } catch (error) {
      console.error("Error creating the post:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create new post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="text"
            id="cover"
            name="cover"
            value={post.cover}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Read time (minutes)</label>
          <input
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Author email</label>
          <input
            type="email"
            id="author"
            name="author"
            value={post.author}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create post
        </button>
      </form>
    </div>
  );
}
