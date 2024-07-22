export default function SinglePost({ post }) {
  return (
    <div className="flex flex-col gap-4 border-2 rounded-md p-6">
        <img src={post.cover} alt={post.title} className="w-full aspect-[2/1] rounded-md" />
        <div className="flex flex-col gap-2">
            <h2 className="text-[24px] font-bold">{post.title}</h2>
            <p className="text-[16px]">by {post.author}</p>
        </div>
        <div className="flex justify-between items-center">
            <strong className="px-4 text-[12px] p-2 rounded-full text-white bg-[#646ECB]">{post.category}</strong>
            <span>Read time: {post.readTime.value} minutes</span>
        </div>
    </div>
  )
}
