export default function SinglePost({ post }) {
  return (
    <div className="flex flex-col gap-4 border-2 rounded-md p-6">
      <img src={post.cover} alt={post.title} className="w-full aspect-[2/1] h-80 rounded-md" />
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-bold h-9">{post.title}</h2>
        <p className="text-[16px] h-6">by {post.author}</p>
        <p className="text-gray-600">{post.content.substring(0, 150)}...</p>
      </div>
      <div className="flex justify-between items-center h-6">
        <strong className="px-4 text-[12px] p-2 rounded-full text-white bg-[#646ECB]">{post.category}</strong>
        <span>Read time: {post.readTime.value} minutes</span>
      </div>
    </div>
  )
}