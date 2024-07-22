import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost, getComments, addComment, getUserData } from "../services/api";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  // Effettua il fetch dei dati del post e dei commenti al caricamento del componente
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData); 
      } catch (error) {
        console.error("Fetching posts error:", error); 
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Fetching comments error:", error);
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
          console.error("Fetching user data error:", error);
          setIsLoggedIn(false); 
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchPost(); 
    checkAuthAndFetchUserData(); 
  }, [id]); 

  // Submit comment handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); 
    if (!isLoggedIn) {
      console.error("Log in to write a comment."); 
      return;
    }
    try {
      const commentData = {
        content: newComment.content,
        name: `${userData.name} ${userData.surname}`,
        email: userData.email,
      };
      const newCommentData = await addComment(id, commentData);

      // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]); 
      setNewComment({ content: "" });
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
      alert(
        `Errore nell'invio del commento: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  if (!post) return <div>Caricamento...</div>; 

  return (
    <div className="container">
      <article className="post-detail">
        <img src={post.cover} alt={post.title} className="post-cover" />
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>Categoria: {post.category}</span>
          <span>Autore: {post.author}</span>
          <span>
            Tempo di lettura: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
        <div
          className="comment-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Sezione commenti */}
        <h3 className="comment-section-title">Commenti</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.content}</p>
            <small>Di: {comment.name}</small>
          </div>
        ))}

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              placeholder="Scrivi un commento..."
            />
            <button type="submit">Invia commento</button>
          </form>
        ) : (
          <p className="no-logged-section">
            <Link to="/login">Accedi</Link> per visualizzare o lasciare
            commenti.
          </p>
        )}
      </article>
    </div>
  );
}