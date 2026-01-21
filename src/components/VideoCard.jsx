
// ============================================================================
// VIDEO CARD COMPONENT - Individual video thumbnail card for grid display
// ============================================================================
import { Eye, ThumbsUp } from "lucide-react";

function VideoCard({ video, onClick,selected }) {
  const formatDuration = (totalSeconds) => {
    totalSeconds = Math.floor(totalSeconds)
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      // Show hours if duration is >= 1 hour
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    } else {
      // Show only minutes:seconds if < 1 hour
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
  }
  return (
    <div
      onClick={onClick}
      className={`${selected===true?'bg-black':'bg-white'} rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:shadow-2xl`}
    >
      <div className="relative pt-[56.25%] bg-gray-200">
        <img
          src={video?.thumbnail.secure_url || 'https://via.placeholder.com/320x180'}
          alt={video?.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video?.duration) || '0'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{video?.title}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <div>
          <img
            src={video?.owner.avatar.secure_url || 'https://via.placeholder.com/32'}
            alt={video?.owner.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-600">{video.owner?.username}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{video.views || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{video.likes || 0}</span>
          </div>
          {typeof video.isPublished === "boolean" && (
            video.isPublished === false ? (
              <div className="flex items-center space-x-1">
                <span>Private</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span>Published</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}


export default VideoCard