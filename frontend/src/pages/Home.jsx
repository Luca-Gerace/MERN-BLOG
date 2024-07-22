import { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import SinglePost from '../components/SinglePost';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // GET to /blogPosts
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

  return (
      <div className="flex flex-col gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : posts.map((post) => (
            // Navigate to sinle post page
            <Link to={`/post/${post._id}`} key={post._id}>
              <SinglePost post={post} />
            </Link>
            ))}
      </div>
  );
}