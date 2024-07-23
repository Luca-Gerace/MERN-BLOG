export default function SingleComment({ comment }) {
  return (
    <div className="border-t-2 pt-3">
        <p>{comment.content}</p>
        <small>by {comment.name}</small>
    </div>
  )
}
