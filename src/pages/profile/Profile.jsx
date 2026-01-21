
// ============================================================================
// PROFILE PAGE COMPONENT - User profile with stats and edit functionality
// ============================================================================
import { useState, useEffect, useRef } from "react";
import { api } from "../../utils/api.js";
import requestHandler from "../../utils/requestHandler.js";
import { useNavigate } from "react-router-dom";
import { Users, PlaySquare, Edit } from "lucide-react";
function ProfilePage({ currentUser }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullname: '', email: '' });
  const avatarRef = useRef();
  const coverImageRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const result = await requestHandler(api.getChannelProfile, currentUser.username)
      setProfile(result.data);
      setFormData({
        fullname: result.data.fullname || '',
        email: result.data.email || ''
      });

    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await requestHandler(api.updateUserDetails, formData)
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleMyTweets = () => {
    navigate("/my-tweets")
  }
  const handleWatchHistory = () => {
    navigate("/watch-history")
  }

  const handleMyVideos = () => {
    navigate("/my-videos")
  }

  const avatarHandler = async (e) => {
    try {
      const file = e.target.files[0]
      const form = new FormData()
      form.append('avatar', file)
      const response = await requestHandler(api.updateUserAvatar, form)
      setProfile({...profile,avatar:response.data.avatar})
    } catch (error) {
      console.log("Could not update avatar Error:",error)
    }
  }
  const coverImageHandler = async (e) => {
    try {
      const file = e.target.files[0]
      const form = new FormData()
      form.append('coverImage', file)
      const response = await requestHandler(api.updateUserCoverImage, form)
      setProfile({...profile,coverImage:response.data.coverImage})
    } catch (error) {
      console.log("Could not update coverImage Error:",error)
    }
  }

   function subscriptionsHandler(){
    navigate("/subscriptions")
  }
   function subscribersHandler(){
    navigate("/subscribers")
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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input onChange={coverImageHandler} ref={coverImageRef} className="hidden" type="file" accept="image/*" />
      <input onChange={avatarHandler} ref={avatarRef} className="hidden" type="file" accept="image/*" />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cover Image Section */}
        <div className="h-48 relative bg-gradient-to-r from-red-500 to-pink-500">
          {isEditing &&
            <button
              onClick={() => { coverImageRef.current.click() }}
              className="absolute right-2 bottom-2 z-10">
              <Edit className="xs:w-6 w-5 h-5 text-black xs:h-6" />
            </button>}
          {profile.coverImage && (
            <img src={profile.coverImage.secure_url} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="flex gap-2 items-center">
              {isEditing &&
                <button
                  onClick={() => { avatarRef.current.click() }}
                  className="z-10">
                  <Edit className="xs:w-6 w-5 h-5 text-black xs:h-6" />
                </button>}
              <img
                src={profile.avatar.secure_url || 'https://via.placeholder.com/120'}
                alt={profile.username}
                className="w-24 h-24 rounded-full object-fit border-4 border-white"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-600">{profile.fullname}</p>
              <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Edit Form Section */}
          {isEditing && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
            onClick={subscribersHandler}
             className="bg-gray-50 p-4 rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{profile.subscriberCount || 0}</p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </button>
            <button
            onClick={subscriptionsHandler}
            className="bg-gray-50 p-4 rounded-lg text-center">
              <PlaySquare className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{profile.subscribedToCount || 0}</p>
              <p className="text-sm text-gray-600">Subscribed To</p>
            </button>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 justify-between">
            <button
              onClick={handleMyTweets}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              My Tweets
            </button>
            <button
              onClick={handleWatchHistory}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Watch History
            </button>
            <button
              onClick={handleMyVideos}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              My Videos
            </button>


          </div>
        </div>
      </div>
    </div>
  );
}


export default ProfilePage