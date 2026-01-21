
// ============================================================================
// HOME PAGE COMPONENT - Displays all videos in a grid layout
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import VideoCard from '../../components/VideoCard.jsx'
import requestHandler from "../../utils/requestHandler.js";
function PlaylistVideosPage() {
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [playlistDetails, setPlaylistDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { _id } = useParams()

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const result = await requestHandler(api.getPlaylistById, _id)
            console.log(result.data)
            setPlaylistVideos(result.data.videos || []);
            setPlaylistDetails(result.data)

        } catch (error) {
            console.error('Failed to fetch videos:', error);
        } finally {
            setLoading(false);
        }
    };

    function onVideoSelect(_id) {
        navigate(`/video/${_id}`)

    }
    function handleAddVideos() {
        navigate(`/`, { state: { isSelecting: true, playlistVideos, playlistId: playlistDetails._id } })
    }

    async function removeVideoFromPlaylist(videoId){
        try {
            await requestHandler(api.removeVideoFromPlaylist,{videoId,playlistId:_id})
            setPlaylistVideos(playlistVideos.filter((video)=>video._id!==videoId))
        } catch (error) {
            console.error("Could not delete video from playlist,Error:",error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex mb-4 justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">{playlistDetails.name}</h1>
                <button
                    onClick={handleAddVideos}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Add Videos
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlistVideos.map((video) => {
                    return (
                        <div className="flex flex-col gap-2">
                            <VideoCard key={video._id} video={video} onClick={() => onVideoSelect(video._id)} />
                            <button
                                onClick={()=>removeVideoFromPlaylist(video._id)}
                                className="self-center px-6 mb-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 m-auto flex justify-center"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default PlaylistVideosPage