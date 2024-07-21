import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/api";

export default function PostDetail() {
  // Hook - store post data
  const [post, setPost] = useState(null);

  // Get post id from URL parameters
  const { id } = useParams();

  // Hook - Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        //  GET /blogPosts/<id>
        const response = await getPost(id);
        setPost(response.data);

      } catch (error) {
        console.error("Fetch single post error:", error);
      }
    };
    fetchPost();
  }, [id]); // Repeat useEffect when the post id is different

  // TODO: Skeleton
  if (!post) return <div>Caricamento...</div>;

  return (
    <div className="container">
      <article className="post-detail">
        <img src={post.cover} alt={post.title} className="post-cover" />
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>Category: {post.category}</span>
          <span>Author: {post.author}</span>
          <span>
            Read time: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
        {/* TODO: remove dangerouslySetInnerHTML */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
