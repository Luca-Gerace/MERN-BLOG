import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/api";
import SinglePost from "../components/SinglePost";

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
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        // Navigate to sinle post page
        <Link to={`/post/${post._id}`} key={post._id} className="post-card">
          <SinglePost post={post} />
        </Link>
      ))}
    </div>
  );
}
