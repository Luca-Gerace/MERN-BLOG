import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, getUserData } from "../services/api";
import { Input, Textarea } from "../components/units";
import Alert from "../components/Alert";

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

  // Hook - alert
  const [alert, setAlert] = useState(null);

  // Hook - user data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setPost((prevPost) => ({ ...prevPost, author: data.email }));
      } catch (error) {
        console.error("User data error:", error);
      }
    };

    fetchUserData();
  }, []);

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
    setCoverFile(e.target.files[0]);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      setAlert({ message: 'User data not loaded. Please try again.', type: 'error' });
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(post).forEach((key) => {
        if (key === 'readTime') {
          formData.append('readTime[value]', post.readTime.value);
          formData.append('readTime[unit]', post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      if (coverFile) {
        formData.append('cover', coverFile);
      }

      // POST to /blogPosts
      await createPost(formData);

      // Go back to Home
      setAlert({ message: 'Post created successfully!', type: 'success' });
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      console.error("Error creating the post:", error);
      setAlert({ message: 'Post creation error. Retry.', type: 'error' });
    }
  };

  return (
    <>
      <h1 className="text-[36px] font-bold text-center mb-6">Create new post</h1>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="create-post-form">
        <Input
          label="Title"
          type="text"
          id='title'
          name='title'
          value={post.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Category"
          type="text"
          id='category'
          name='category'
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
        <button type="submit" className="w-full mt-4 p-4 text-white bg-[#646ECB] rounded-md">Create post</button>
      </form>
    </>
  );
}