export default function SkeletonArticle() {
  return (
    <div className="animate-pulse">
      <div className="skeleton-image w-full h-80 bg-gray-300 rounded-md mb-4"></div>
      <div className="skeleton-title h-9 bg-gray-300 rounded-md mb-2"></div>
      <div className="skeleton-text h-6 bg-gray-300 rounded-md mb-2"></div>
      <div className="skeleton-text h-12 bg-gray-300 rounded-md mb-2"></div>
      <div className="skeleton-text h-6 bg-gray-300 rounded-md mb-2"></div>
    </div>
  );
}