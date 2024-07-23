import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { getPost, getComments, addComment, getUserData, updatePost, deletePost, updateCover } from "../services/api";
import { Input, Textarea } from "../components/units";
import CommentArea from "../components/CommentArea";
import EditIcon from '@mui/icons-material/Edit';
import Alert from '../components/Alert';
import SkeletonArticle from '../components/SkeletonArticle';

// React-modal default class configuration
Modal.setAppElement('#root');

export default function PostDetail() {
  // Hooks
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [editPostData, setEditPostData] = useState({ title: "", content: "", category: "", author: "" });
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [alert, setAlert] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData.data);
        setComments(postData.data.comments);
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

      setComments((prevComments) => [...prevComments, newCommentData]);
      // reset
      setNewComment({ content: "" });
      // Show success alert
      setAlert({ message: 'Comment added with success!', type: 'success' });

    } catch (error) {
      console.error("Comment error:", error);
      // Show error alert
      setAlert({ message: 'Comment error!', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      
      // Go to home
        setTimeout(() => {
          navigate('/');
      }, 2000);

      // Show success alert
      setAlert({ message: 'Post deleted with success', type: 'success' });


    } catch (error) {
      console.error('Error deleting post:', error);
      // Show error alert
      setAlert({ message: 'Error deleting post, try again', type: 'error' });      
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        title: editPostData.title,
        content: editPostData.content,
        category: editPostData.category,
        author: userData.email, // Aggiungi l'email dell'utente loggato come autore
      };

      const updatedPost = await updatePost(id, formData);
      setPost(updatedPost.data);
      setIsEditModalOpen(false);

      // Show success alert
      setAlert({ message: 'Post updated with success!', type: 'success' });
      
    } catch (error) {
      console.error('Error updating post:', error);

      // Show error alert
      setAlert({ message: 'Error updating post, try again', type: 'error' });
    }
  };

  const handleCoverUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editCoverFile) {
        formData.append('cover', editCoverFile);
      }
  
      const updatedPost = await updateCover(id, formData);
      setPost(updatedPost.data); // Update post
      setIsCoverModalOpen(false); // Close modal
      
      // Show success alert
      setAlert({ message: 'Cover image updated with success', type: 'success' });

    } catch (error) {
      console.error('Error updating cover:', error);

      // Show error alert
      setAlert({ message: 'Error updating post cover, try again', type: 'error' });

    }
  };

  const handleUpdateComment = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  // Modals triggers
  const openEditModal = () => {
    setEditPostData({ title: post.title, content: post.content, category: post.category, author: post.author });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openCoverModal = () => {
    setIsCoverModalOpen(true);
  };

  const closeCoverModal = () => {
    setIsCoverModalOpen(false);
  };

  if (!post) return <SkeletonArticle />;

  return (
    <div className="container">
      <article className="flex flex-col gap-4 p-6">
        {userData && userData.email === post.author && (
          <div className="flex justify-end gap-2">
            <button onClick={openCoverModal} className="relative top-[170px] left-[130px] md:top-[300px] md:left-[100px] shadow-xl bg-white p-4 rounded-full text-[#242424] hover:shadow-2xl hover:scale-125"><EditIcon /></button>
            <button onClick={openEditModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit</button>
            <button onClick={openDeleteModal} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
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

        {/* Comment area */}
        <CommentArea 
          comments={comments} 
          userData={userData} 
          postId={id} 
          onUpdateComment={handleUpdateComment} 
          onDeleteComment={handleDeleteComment} 
        />

        {/* Comment form */}
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Post"
        className="w-full lg:w-1/2 max-w-[600px] mx-auto bg-white p-6 rounded-md shadow-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label="Title"
            type="text"
            id='updatedTitle'
            name='updatedTitle'
            value={editPostData.title}
            onChange={(e) => setEditPostData({ ...editPostData, title: e.target.value })}
            required
            className="border-2 p-2 rounded-md"
          />
          <Textarea
            label="Content"
            id='updatedContent'
            name='updatedContent'
            value={editPostData.content}
            onChange={(e) => setEditPostData({ ...editPostData, content: e.target.value })}
            required
          />
          <Input
            label="Category"
            type="text"
            id='updatedCategory'
            name='updatedCategory'
            value={editPostData.category}
            onChange={(e) => setEditPostData({ ...editPostData, category: e.target.value })}
            required
            className="border-2 p-2 rounded-md"
          />
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save Changes</button>
            <button type="button" onClick={closeEditModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Cover Modal */}
      <Modal
        isOpen={isCoverModalOpen}
        onRequestClose={closeCoverModal}
        contentLabel="Update Cover"
        className="w-full lg:w-1/2 max-w-[600px] mx-auto bg-white p-6 rounded-md shadow-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Update Cover Image</h2>
        <form onSubmit={handleCoverUpdate} className="flex flex-col gap-4">
          <Input
            label="Cover Image"
            type="file"
            id='cover'
            name='cover'
            onChange={(e) => setEditCoverFile(e.target.files[0])}
            className="border-2 p-2 rounded-md"
          />
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Update Cover</button>
            <button type="button" onClick={closeCoverModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Post"
        className="w-full lg:w-1/2 max-w-[600px] mx-auto bg-white p-6 rounded-md shadow-md"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-12">Are you sure you want to delete this post?</h2>
        <div className="flex justify-end gap-2">
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirm</button>
          <button onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
        </div>
      </Modal>
      {/* Alert */}
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </div>
  );
}