import SingleComment from "./SingleComment";

export default function CommentArea({ comments, userData, postId, onUpdateComment, onDeleteComment }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-[#efefef] rounded-md">
      <h3 className="text-[18px] font-bold">Comments</h3>
      {comments.map((comment) => (
        <SingleComment 
          comment={comment} 
          key={comment._id} 
          userData={userData} 
          postId={postId} 
          onUpdateComment={onUpdateComment} 
          onDeleteComment={onDeleteComment} 
        />
      ))}
    </div>
  );
}