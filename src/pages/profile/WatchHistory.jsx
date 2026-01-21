
// ============================================================================
// PLAYLISTS PAGE COMPONENT - Display and manage user playlists
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { List, Plus } from 'lucide-react'
import requestHandler from "../../utils/requestHandler.js";
import VideoCard from "../../components/VideoCard.jsx";
import { useNavigate } from "react-router-dom";
function WatchHistoryPage({ currentUser }) {
    const [watchHistory, setWatchHistory] = useState(null);

    const navigate = useNavigate()
    useEffect(() => {
        fetchWatchHistory();
    }, [currentUser]);

    const fetchWatchHistory = async () => {
        try {
            const result = await requestHandler(api.getWatchHistory)
            setWatchHistory(result.data.watchHistory || []);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        }
    };

    function onVideoSelect(_id) {
        navigate(`/video/${_id}`)
    }
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

  if (!watchHistory) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center space-x-2">
                    <span>Your Watch History</span>
                </h1>
            </div>


            {/* Playlists Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchHistory.map((video) => (
                    <VideoCard key={video._id} video={video} onClick={() => onVideoSelect(video._id)} />
                ))}
            </div>
        </div>
    );
}

export default WatchHistoryPage
