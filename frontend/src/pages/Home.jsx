import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/api";

export default function Home() {
  
  // Hook - posts array
  const [posts, setPosts] = useState([]);

  // Hook - fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // GET to /blogPosts
        const response = await getPosts();
        setPosts(response.data);

      } catch (error) {
        console.error("Fetch posts error:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold underline">Posts List</h1>
      <div className="post-grid">

        {posts.map((post) => (
          // Navigate to sinle post page
          <Link to={`/post/${post._id}`} key={post._id} className="post-card">
            <img src={post.cover} alt={post.title} className="post-image" />
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>Author: {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
