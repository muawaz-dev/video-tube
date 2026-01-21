
// ============================================================================
// TWEETS PAGE COMPONENT - Display and manage user tweets
// ============================================================================
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from 'lucide-react'

function TweetsPage({ currentUser }) {
  const [tweets, setTweets] = useState([]);
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const result = await requestHandler(api.getAllTweets)
      setTweets(result.data || []);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleMyTweets = ()=>{
    navigate("/my-tweets")
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
      <div className="flex align-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Tweets</h1>
        {currentUser && <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={handleMyTweets}
        >
          Manage Tweets
        </button>
        }
      </div>

      {/* Tweets List Section */}
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3 flex-1">
                <img
                  src={tweet.owner?.avatar.secure_url || 'https://via.placeholder.com/48'}
                  alt={tweet.owner?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">{tweet.owner?.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(tweet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{tweet.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TweetsPage