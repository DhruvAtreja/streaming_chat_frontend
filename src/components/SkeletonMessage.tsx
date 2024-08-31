export default function SkeletonMessage() {
  return (
    <div className="flex justify-start mb-4 relative">
      <img
        src="/logo.jpeg"
        alt="Bot Icon"
        className="absolute left-0 top-4 w-8 h-8 rounded-full"
        style={{ transform: "translateX(-120%)" }}
      />
      <div className="w-full p-5 rounded-3xl bg-gray-700 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
}
