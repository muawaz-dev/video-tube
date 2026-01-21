// ============================================================================
// PROFILE PAGE COMPONENT - User profile with stats and edit functionality
// ============================================================================
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { useNavigate, useParams } from "react-router-dom";
import { Users, PlaySquare } from "lucide-react";
function ChannelProfilePage({ currentUser }) {
    const [channel, setChannel] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(null)
    const { username } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProfile();
    }, [currentUser]);

    const fetchProfile = async () => {
        try {
            const result = await requestHandler(api.getChannelProfile, username)
            setChannel(result.data);
            setIsSubscribed(result.data.isUserSubscribed)
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };



    if (!channel) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const handleSubscribe = async () => {
        if (!currentUser) return;
        try {
            await requestHandler(api.toggleSubscription, currentUser._id);
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error('Failed to toggle subscription:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cover Image Section */}
                <div className="h-48 relative bg-gradient-to-r from-red-500 to-pink-500">
                    {channel.coverImage && (
                        <img src={channel.coverImage.secure_url} alt="Cover" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Profile Info Section */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                        <div className="flex gap-2 items-center">
                            <img
                                src={channel.avatar.secure_url || 'https://via.placeholder.com/120'}
                                alt={channel.username}
                                className="w-24 h-24 rounded-full object-fit border-4 border-white"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">{channel.username}</h1>
                            <p className="text-gray-600">{channel.fullname}</p>
                            <p className="text-sm text-gray-500 mt-1">{channel.email}</p>
                        </div>
                    </div>

                    {/* Edit Form Section */}

                    {/* Stats Section */}
                    <div className="flex flex-col gap-4 mb-6 justify-center">
                        <div
                            className="bg-gray-50 p-4 rounded-lg text-center">
                            <Users className="w-8 h-8 mx-auto mb-2 text-red-600" />
                            <p className="text-2xl font-bold">{channel.subscriberCount || 0}</p>
                            <p className="text-sm text-gray-600">Subscribers</p>
                        </div>
                        <div
                            className="bg-gray-50 p-4 rounded-lg text-center">
                            <PlaySquare className="w-8 h-8 mx-auto mb-2 text-red-600" />
                            <p className="text-2xl font-bold">{channel.subscribedToCount || 0}</p>
                            <p className="text-sm text-gray-600">Subscribed To</p>
                        </div>
                        <div
                            className="bg-gray-50 p-4 rounded-lg text-center">
                            {currentUser &&
                                < button
                                    onClick={handleSubscribe}
                                    className={`xs:justify-self-end justify-self-center px-4 w-32 py-2 rounded-full font-medium transition ${isSubscribed
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                >
                                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                                </button>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default ChannelProfilePage