
// ============================================================================
// LIKED VIDEOS PAGE COMPONENT - Display user's liked videos
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import requestHandler from '../../utils/requestHandler.js'
import VideoCard from "../../components/VideoCard.jsx";
function LikedVideosPage({currentUser}) {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    fetchLikedVideos();
  }, [currentUser]);

  const fetchLikedVideos = async () => {
    try {
      const result = await requestHandler(api.getLikedVideos)
      setLikedVideos(result.data || []);
      console.log(result)
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
    } finally {
      setLoading(false);
    }
  };
  if (!currentUser) {
    return (
      <div className="p-8 mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Please log in to view this page</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  function onVideoSelect(_id){
    navigate(`/video/${_id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <Heart className="w-8 h-8 text-red-600" />
        <span>Liked Videos</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likedVideos.map((video) => (
          <VideoCard key={video.video._id} video={video.video} onClick={() => onVideoSelect(video.video._id)} />
        ))}
      </div>
    </div>
  );
}

export default LikedVideosPage