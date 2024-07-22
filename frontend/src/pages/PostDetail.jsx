import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, getComments, addComment, getUserData, updatePost, deletePost } from "../services/api";
import { Textarea } from "../components/units";
import CommentArea from "../components/CommentArea";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData.data);
      } catch (error) {
        console.error("Post data error:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Comment data error:", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const data = await getUserData();
          setUserData(data);
          fetchComments();
        } catch (error) {
          console.error("User data error:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchPost();
    checkAuthAndFetchUserData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      console.error("Login to write a comment.");
      return;
    }
    try {
      const commentData = {
        content: newComment.content,
        name: `${userData.name} ${userData.surname}`,
        email: userData.email,
      };
      const newCommentData = await addComment(id, commentData);

      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment({ content: "" });
    } catch (error) {
      console.error("Comment error:", error);
      alert(
        `Comment error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async () => {
    const updatedContent = prompt('Enter new content:');
    if (updatedContent) {
      try {
        const updatedPost = await updatePost(id, { content: updatedContent });
        setPost(updatedPost);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container">
      <article className="flex flex-col gap-4 p-6">
        {userData && userData.email === post.author && (
          <div className="flex justify-end gap-2">
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
          </div>
        )}
        <img src={post.cover} alt={post.title} className="w-full aspect-[2/1] rounded-md" />
        <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-bold">{post.title}</h2>
            <p className="text-[16px]">by {post.author}</p>
        </div>
        <div
          className="comment-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="flex justify-between items-center mb-6">
            <strong className="px-4 text-[12px] p-2 rounded-full text-white bg-[#646ECB]">{post.category}</strong>
            <span>Read time: {post.readTime.value} minutes</span>
        </div>

        <CommentArea comments={comments} />

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit}>
            <Textarea
              type="text"
              id="content"
              name="content"
              placeholder="Write a comment..."
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              required
            />
            <button type="submit" className="w-full mt-4 p-4 text-white bg-[#646ECB] rounded-md">Add comment</button>
          </form>
        ) : (
          <p className="no-logged-section">
            <Link to="/login" className="text-[#646ECB] underline cursor-pointer">Login</Link> to see and write comments
          </p>
        )}
      </article>
    </div>
  );
}