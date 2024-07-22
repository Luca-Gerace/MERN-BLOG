import { useState, useEffect } from 'react';
import { getPosts, updatePost, deletePost } from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import SinglePost from '../components/SinglePost';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async (postId) => {
    const updatedContent = prompt('Enter new content:');
    if (updatedContent) {
      try {
        const updatedPost = await updatePost(postId, { content: updatedContent });
        setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        : posts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id}>
              <SinglePost post={post} onUpdate={handleUpdate} onDelete={handleDelete} />
            </Link>
          ))}
    </div>
  );
}