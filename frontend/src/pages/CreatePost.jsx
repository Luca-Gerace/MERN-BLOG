import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import { Input, Textarea } from "../components/units";

export default function CreatePost() {

  // Hook - post cover file
  const [coverFile, setCoverFile] = useState(null);

  // Hook - new post
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

  // Form fields Handler
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

  // Form cover file handler
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0])
  }

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // TODO: Handle ...
      const formData = new FormData();

      Object.keys(post).forEach((key) => {
        if (key === 'readTime') {
          formData.append('readTime[value]', post.readTime.value);
          formData.append('readTime[unit]', post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      })

      if (coverFile) {
        formData.append('cover', coverFile);
      }

      // POST to /blogPosts
      await createPost(formData);

      // Go back to Home
      navigate("/");

    } catch (error) {
      console.error("Error creating the post:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create new post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <Input
          label="Title"
          type="text"
          id="title"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Category"
          type="text"
          id="category"
          name="category"
          value={post.category}
          onChange={handleChange}
          required
        />
        <Textarea
          label="Content"
          type="text"
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        />
        <Input
          label="Image"
          type="file"
          id="cover"
          name="cover"
          value={post.cover}
          onChange={handleFileChange}
          required
        />
        <Input
          label="Read time (minutes)"
          type="number"
          id="readTimeValue"
          name="readTimeValue"
          value={post.readTime.value}
          onChange={handleChange}
          required
        />
        <Input
          label="Author email"
          type="email"
          id="author"
          name="author"
          value={post.author}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button">
          Create post
        </button>
      </form>
    </div>
  );
}
