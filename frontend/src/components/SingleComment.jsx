import { useState } from "react";
import { updateComment, deleteComment } from "../services/api";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Alert from "./Alert";
import { Textarea } from "./units";

export default function SingleComment({ comment, userData, postId, onUpdateComment, onDeleteComment }) {
  // Hooks
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);
  const [alert, setAlert] = useState(null);

  // Handle comment deletion
  const handleDelete = async () => {
    try {
      await deleteComment(postId, comment._id);
      onDeleteComment(comment._id); // Call the delete handler passed as prop
      setAlert({ message: 'Comment deleted with success!', type: 'success' });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setAlert({ message: 'Error deleting comment, try again', type: 'error' });
    }
  };

  // Handle comment update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedComment = await updateComment(postId, comment._id, { content: updatedContent });
      onUpdateComment(updatedComment); // Call the update handler passed as prop
      setIsEditing(false);
      setAlert({ message: 'Comment updated with success!', type: 'success' });
    } catch (error) {
      console.error("Error updating comment:", error);
      setAlert({ message: 'Error updating comment, try again', type: 'error' });
    }
  };

  return (
    <>
      <div className={`border-t-2 pt-3 ${isEditing ? 'flex-col justify-start items-start' : 'flex justify-between items-center'}`}>
        {isEditing ? (
          <form onSubmit={handleUpdate} className="w-full">
            <Textarea
              value={updatedContent}
              id='updatedComment'
              name='comment'
              placeholder=''
              onChange={(e) => setUpdatedContent(e.target.value)}
              required
              className="border-2 p-2 rounded-md mb-2"
            />
            <div className="flex items-center gap-6">
              <button className="bg-[#319231] p-2 rounded-full text-white" type="submit"><CheckIcon /></button>
              <button className="bg-[#c32b2b] p-2 rounded-full text-white" type="button" onClick={() => setIsEditing(false)}><CloseIcon /></button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <p>{comment.content}</p>
              <small>by {comment.name}</small>
            </div>
            {userData && userData.email === comment.email && (
              <div className="flex items-center justify-between gap-4">
                <button className="bg-[#a8a8a8] p-2 rounded-full text-white" onClick={() => setIsEditing(true)}><EditIcon /></button>
                <button className="bg-[#a8a8a8] p-2 rounded-full text-white" onClick={handleDelete}><DeleteIcon /></button>
              </div>
            )}
          </>
        )}
      </div>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
    </>
  );
}