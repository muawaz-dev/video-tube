
// ============================================================================
// TWEETS PAGE COMPONENT - Display and manage user tweets
// ============================================================================
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { Plus, Trash2, Edit,Minus } from 'lucide-react'
import { useNavigate } from "react-router-dom";
function MyTweetsPage({ currentUser }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTweet, setNewTweet] = useState('');
  const [isEditing, setIsEditing] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const result = await requestHandler(api.getUserTweets)
      setTweets(result.data || []);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return;
    try {
      await requestHandler(api.createTweet, { content: newTweet })
      setNewTweet('');
      fetchTweets();
    } catch (error) {
      console.error('Failed to create tweet:', error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!confirm('Delete this tweet?')) return;
    try {
      await requestHandler(api.deleteTweet, tweetId)
      fetchTweets();
    } catch (error) {
      console.error('Failed to delete tweet:', error);
    }
  };

  const handleUpdateTweet = async () =>{
    if(!newTweet.trim()) return;
    try {
      const response = await requestHandler(api.updateTweet,{content:newTweet,tweetId:isEditing})
      setTweets(tweets.map((tweet)=>{
        if(tweet._id===response.data._id)return response.data
        return tweet
      }))
      setIsEditing(null)
      setNewTweet('')
    } catch (error) {
      console.log("Failed to update tweet:",error)
    }
  }
  const handleCancelUpdate = async () =>{
    setIsEditing(null)
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

    if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Tweets</h1>

      {isEditing ?
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
            rows="3"
          />
          <div className="flex gap-2 justify-end mt-3">
            <button
              onClick={handleUpdateTweet}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <span>Update</span>
            </button>
            <button
              onClick={handleCancelUpdate}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <span>Cancel</span>
            </button>
          </div>
        </div> :
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
            rows="3"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleCreateTweet}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Tweet</span>
            </button>
          </div>
        </div>
      }



      {/* Tweets List Section */}
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3 flex-1">
                <img
                  src={currentUser?.avatar.secure_url || 'https://via.placeholder.com/48'}
                  alt={currentUser?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">{currentUser?.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(tweet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{tweet.content}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(tweet._id)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteTweet(tweet._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTweetsPage