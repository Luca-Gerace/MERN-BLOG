export default function SingleComment({ comment }) {
  return (
    <div className="comment">
        <p>{comment.content}</p>
        <small>by {comment.name}</small>
    </div>
  )
}
