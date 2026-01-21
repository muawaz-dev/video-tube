
// ============================================================================
// HOME PAGE COMPONENT - Displays all videos in a grid layout
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import VideoCard from '../../components/VideoCard.jsx'
import requestHandler from "../../utils/requestHandler.js";
function HomePage() {
  const location = useLocation()
  const {searchQuery} = useParams()
  const isSelecting = location.state?.isSelecting
  let initialPlaylistVideos = location.state?.playlistVideos
  const playlistId = location.state?.playlistId
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistVideos, setPlaylistVideos] = useState(initialPlaylistVideos)
  const navigate = useNavigate()

  useEffect(() => {
    fetchVideos();
  }, [searchQuery]);

  const fetchVideos = async () => {
    try {
      const result = await requestHandler(api.getAllVideos,{
      params: {
        page: 1,
        limit: 10,
        query: searchQuery || "",
        sortBy: "views",
        sortType: "-1"
      }})
      console.log(result)
      setVideos(result.data.docs || []);

    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  function onVideoSelect(_id) {
    if (isSelecting) {
      setPlaylistVideos(playlistVideos.length ?
        playlistVideos.filter((videoId) => {
          return videoId !== _id
        })
        :
        [_id]
      )

    }
    else {
      navigate(`/video/${_id}`)
    }
  }
  async function saveVideosToPlaylist() {
    try {
      await requestHandler(api.addVideosToPlaylist,{playlistId,videos:playlistVideos})
      navigate("/playlists")
    } catch (error) {
      console.error("Could not add videos to playlist, Error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  console.log(playlistVideos)

  return (
    <div className="p-6">
      {isSelecting ?
        <div className="flex mb-4 justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Select Videos</h1>
          <button
            onClick={saveVideosToPlaylist}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Save
          </button>
        </div>
        :
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Discover Videos</h1>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const selected = isSelecting ? playlistVideos.includes(video._id) : undefined
          return <VideoCard selected={selected} key={video._id} video={video} onClick={() => onVideoSelect(video._id)} />
        })}
      </div>
    </div>
  );
}

export default HomePage