
// ============================================================================
// TWEETS PAGE COMPONENT - Display and manage user tweets
// ============================================================================
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { useNavigate } from "react-router-dom";
import { Users } from 'lucide-react'

function SubscribersPage({ currentUser }) {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        fetchTweets();
    }, []);

    const fetchTweets = async () => {
        try {
            const result = await requestHandler(api.subscribers)
            setSubscribers(result.data || []);

        } catch (error) {
            console.error('Failed to fetch tweets:', error);
        }
        finally {
            setLoading(false)
        }
    };

    function handleSubscriberClick(username) {
        navigate(`/channel/${username}`)
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
            <div className="flex align-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Your Subscribers</h1>
            </div>

            {/* Tweets List Section */}
            <div className="space-y-4">
                {subscribers.map((subscriber) => (
                    <div
                     onClick={()=>handleSubscriberClick(subscriber?.subscriber.username)}
                    key={subscriber.subscriber._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex space-x-3 flex-1 items-center">
                                <img
                                    src={subscriber?.subscriber.avatar.secure_url || 'https://via.placeholder.com/48'}
                                    alt={subscriber?.subscriber.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold">{subscriber?.subscriber.username}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="bg-gray-50 p-2 rounded-lg text-center flex flex-col">
                                        <Users className="w-4 h-4 mx-auto mb-2 text-red-600" />
                                        <p className="text-xl">{subscriber?.subscriber.subscribers || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SubscribersPage