
// ============================================================================
// LIKED VIDEOS PAGE COMPONENT - Display user's liked videos
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import requestHandler from '../../utils/requestHandler.js'
import VideoCard from "../../components/VideoCard.jsx";
function MyVideosPage({ currentUser }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const result = await requestHandler(api.getUserVideos)
      setVideos(result.data || []);
    } catch (error) {
      console.error('Failed to fetch My videos:', error);
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

  function onVideoSelect(_id) {
    navigate(`/edit-video/${_id}`)
  }

  async function onDelete(_id) {
    setDeleting(true)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      await requestHandler(api.deleteVideo, _id)
      setVideos(videos.filter((video) => {
        video._id !== _id;
      }))
    } catch (error) {
      console.error("Could not delete video", error)
    }
    finally{
      setDeleting(false)
    }

  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        {
          deleting ?
            <span>Deleting Video...</span> :
            <span>My Videos</span>
        }
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div className="flex flex-col gap-1">
            <VideoCard key={video?._id} video={video} />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onVideoSelect(video?._id)}
                className="px-4 w-[40%] flex justify-center bg-red-600 text-white rounded-lg hover:bg-red-900 transition"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(video?._id)}
                className="px-4 w-[40%] flex justify-center bg-red-600 text-white rounded-lg hover:bg-red-900 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}

export default MyVideosPage