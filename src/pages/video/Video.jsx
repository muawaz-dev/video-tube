
// ============================================================================
// VIDEO PAGE COMPONENT - Full video player with details, likes, and comments
// ============================================================================
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import { useParams } from "react-router-dom";
import requestHandler from "../../utils/requestHandler.js";
import { Eye, ChevronDown, ChevronUp, ThumbsUp, Edit } from "lucide-react";
import CommentCard from '../../components/CommentCard.jsx'
import { useNavigate } from 'react-router-dom'
function VideoPage({ currentUser }) {
  const [videoDetails, setVideoDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isWatched, setIsWatched] = useState(true);
  const navigate = useNavigate()
  const { _id } = useParams()

  useEffect(() => {
    fetchVideoDetails();
    fetchComments();

  }, [_id, currentUser]);

  const fetchVideoDetails = async () => {
    try {
      const result = await requestHandler(api.getVideoById, _id)
      setVideoDetails(result.data);
      setIsSubscribed(result.data?.owner.isUserSubscribed)
      setIsLiked(result.data?.likedByUser)
      setIsWatched(result.data.isWatched)
    } catch (error) {
      console.error('Failed to fetch video details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const result = await requestHandler(api.getVideoComments, _id)
      setComments(result.data.docs || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const incrementView = async () => {
    try {
      await requestHandler(api.incrementView, _id);
    } catch (error) {
      console.error('Failed to increment view:', error);
    }
  };

  const pushWatchHistory = async () => {
    try {
      await requestHandler(api.pushWatchHistory, _id)
    } catch (error) {
      console.log("Failed to push to watch history", error)
    }
  }


  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await requestHandler(api.toggleVideoLike, _id);
      setVideoDetails({
        ...videoDetails,
        likes: isLiked ?
          videoDetails.likes - 1 :
          videoDetails.likes + 1
      })
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) return;
    try {
      await requestHandler(api.toggleSubscription, videoDetails.owner._id);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim()) return;
    try {
      await requestHandler(api.addComment, { videoId: _id, content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleVideoPlay = async () => {
    incrementView();
    if (!isWatched && currentUser) {
      pushWatchHistory();
    }
  }

  const onBack = async () => {
    navigate("/")
  }




  if (!videoDetails) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <span>← Back to videos</span>
      </button>

      {/* Video Player Section */}
      <div className="bg-black rounded-lg overflow-hidden mb-6">
        <div className="relative pt-[56.25%]">
          <video
            src={videoDetails.videoFile.secure_url}
            controls
            className="absolute inset-0 w-full h-full"
            poster={videoDetails.thumbnail.secure_url}
            onPlay={handleVideoPlay}
          />
        </div>
      </div>
      {/* Video Title and Actions Section */}

      <div className="flex justify-between align-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{videoDetails.title}</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{videoDetails.views || 0} views</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{videoDetails.likes || 0}</span>
          </button>
        </div>
      </div>

      {/* Channel Info Section */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] items-center">
          <div className="flex gap-2 xs:justify-self-start justify-self-center">
            <img
              src={videoDetails.owner?.avatar.secure_url || 'https://via.placeholder.com/48'}
              alt={videoDetails.owner?.username}
              className="sm:w-12 sm:h-12 w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-lg">{videoDetails.owner?.username}</h3>
              <p className="text-sm text-gray-600">{videoDetails.owner?.subscriberCount || 0} subscribers</p>
            </div>

          </div>
          {currentUser && (
            <button
              onClick={handleSubscribe}
              className={`xs:justify-self-end justify-self-center px-4 w-32 py-2 rounded-full font-medium transition ${isSubscribed
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-red-600 text-white hover:bg-red-700'
                }`}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* Description Dropdown Section */}
        <div className="mt-4">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >

            <span className="font-medium">Description</span>

            {showDescription ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showDescription && (
            <p className="mt-3 text-gray-600 whitespace-pre-wrap">
              {videoDetails.description || 'No description available.'}
            </p>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>

        {currentUser && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
              rows="3"
            />
            <div className="flex justify-center xs:justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Comment
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPage