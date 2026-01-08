import React, { useState, useEffect } from 'react';
import { Home, User, MessageSquare, Search, ThumbsUp, Eye, Users, Edit, Trash2, Plus, List, LogOut, Menu, X, PlaySquare, Clock, Heart, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================================
// UTILITY FUNCTIONS & API SERVICE
// ============================================================================

const API_BASE_URL = 'http://localhost:8000/api'; // Update with your API URL

const api = {
  // Auth endpoints
  register: (formData) => fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    body: formData
  }),
  login: (data) => fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  logout: (token) => fetch(`${API_BASE_URL}/user/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // Video endpoints
  getAllVideos: () => fetch(`${API_BASE_URL}/video/all-videos`),
  getVideoById: (videoId, token) => fetch(`${API_BASE_URL}/video/video/${videoId}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  }),
  incrementView: (videoId, token) => fetch(`${API_BASE_URL}/video/increment-view/${videoId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // User endpoints
  getCurrentUser: (token) => fetch(`${API_BASE_URL}/user/current-user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  getChannelProfile: (username, token) => fetch(`${API_BASE_URL}/user/channel-profile/${username}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  }),
  updateUserDetails: (data, token) => fetch(`${API_BASE_URL}/user/update-details`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  
  // Like endpoints
  toggleVideoLike: (videoId, token) => fetch(`${API_BASE_URL}/like/video-like/${videoId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  getLikedVideos: (token) => fetch(`${API_BASE_URL}/like/liked-videos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // Comment endpoints
  getVideoComments: (videoId) => fetch(`${API_BASE_URL}/comment/video-comments/${videoId}`),
  addComment: (data, token) => fetch(`${API_BASE_URL}/comment/add`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateComment: (data, token) => fetch(`${API_BASE_URL}/comment/update`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteComment: (commentId, token) => fetch(`${API_BASE_URL}/comment/delete/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // Subscription endpoints
  toggleSubscription: (channelId, token) => fetch(`${API_BASE_URL}/subscription/toggle-subscription/${channelId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // Tweet endpoints
  getUserTweets: (token) => fetch(`${API_BASE_URL}/tweet/user-tweets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  createTweet: (data, token) => fetch(`${API_BASE_URL}/tweet/create-tweet`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteTweet: (tweetId, token) => fetch(`${API_BASE_URL}/tweet/delete/${tweetId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  
  // Playlist endpoints
  getUserPlaylists: (token) => fetch(`${API_BASE_URL}/playlist/user-playlists`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }),
  createPlaylist: (data, token) => fetch(`${API_BASE_URL}/playlist/create`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function YouTubeCloneApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authToken) {
      fetchCurrentUser();
    }
  }, [authToken]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.getCurrentUser(authToken);
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout(authToken);
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setCurrentUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        {/* Sidebar Section */}
        <Sidebar 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Section */}
        <main className="flex-1 lg:ml-64 pt-16">
          {!authToken && (currentPage === 'login' || currentPage === 'register') ? (
            currentPage === 'login' ? (
              <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
            ) : (
              <RegisterPage onNavigate={setCurrentPage} />
            )
          ) : currentPage === 'home' ? (
            <HomePage 
              authToken={authToken}
              onVideoSelect={(video) => {
                setSelectedVideo(video);
                setCurrentPage('video');
              }}
            />
          ) : currentPage === 'video' && selectedVideo ? (
            <VideoPage 
              video={selectedVideo}
              authToken={authToken}
              currentUser={currentUser}
              onBack={() => setCurrentPage('home')}
            />
          ) : currentPage === 'profile' && authToken ? (
            <ProfilePage authToken={authToken} currentUser={currentUser} />
          ) : currentPage === 'tweets' && authToken ? (
            <TweetsPage authToken={authToken} currentUser={currentUser} />
          ) : currentPage === 'liked' && authToken ? (
            <LikedVideosPage authToken={authToken} onVideoSelect={(video) => {
              setSelectedVideo(video);
              setCurrentPage('video');
            }} />
          ) : currentPage === 'playlists' && authToken ? (
            <PlaylistsPage authToken={authToken} />
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-700">Please log in to view this page</h2>
              <button
                onClick={() => setCurrentPage('login')}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT - Top navigation bar with search and user actions
// ============================================================================

function Header({ currentUser, onLogout, onNavigate, setSidebarOpen, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Menu Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <PlaySquare className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold hidden sm:block">VideoTube</span>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-red-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Actions Section */}
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center space-x-2 mr-4">
                <img
                  src={currentUser.avatar || 'https://via.placeholder.com/40'}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-sm">{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// SIDEBAR COMPONENT - Navigation menu with Home, Profile, Tweets sections
// ============================================================================

function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tweets', label: 'Tweets', icon: MessageSquare },
    { id: 'liked', label: 'Liked Videos', icon: Heart },
    { id: 'playlists', label: 'Playlists', icon: List },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? 'bg-red-50 text-red-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

// ============================================================================
// HOME PAGE COMPONENT - Displays all videos in a grid layout
// ============================================================================

function HomePage({ authToken, onVideoSelect }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.getAllVideos();
      if (response.ok) {
        const data = await response.json();
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Discover Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} onClick={() => onVideoSelect(video)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VIDEO CARD COMPONENT - Individual video thumbnail card for grid display
// ============================================================================

function VideoCard({ video, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
    >
      <div className="relative pt-[56.25%] bg-gray-200">
        <img
          src={video.thumbnail || 'https://via.placeholder.com/320x180'}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration || '10:23'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{video.title}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={video.owner?.avatar || 'https://via.placeholder.com/32'}
            alt={video.owner?.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-600">{video.owner?.username}</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{video.views || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{video.likes || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIDEO PAGE COMPONENT - Full video player with details, likes, and comments
// ============================================================================

function VideoPage({ video, authToken, currentUser, onBack }) {
  const [videoDetails, setVideoDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchVideoDetails();
    fetchComments();
    if (authToken) {
      incrementView();
    }
  }, [video._id]);

  const fetchVideoDetails = async () => {
    try {
      const response = await api.getVideoById(video._id, authToken);
      if (response.ok) {
        const data = await response.json();
        setVideoDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch video details:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.getVideoComments(video._id);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const incrementView = async () => {
    try {
      await api.incrementView(video._id, authToken);
    } catch (error) {
      console.error('Failed to increment view:', error);
    }
  };

  const handleLike = async () => {
    if (!authToken) return;
    try {
      await api.toggleVideoLike(video._id, authToken);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!authToken) return;
    try {
      await api.toggleSubscription(videoDetails.owner._id, authToken);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const handleAddComment = async () => {
    if (!authToken || !newComment.trim()) return;
    try {
      const response = await api.addComment({ videoId: video._id, content: newComment }, authToken);
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const displayVideo = videoDetails || video;

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
            src={displayVideo.videoFile}
            controls
            className="absolute inset-0 w-full h-full"
            poster={displayVideo.thumbnail}
          />
        </div>
      </div>

      {/* Video Title and Actions Section */}
      <h1 className="text-2xl font-bold mb-4">{displayVideo.title}</h1>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{displayVideo.views || 0} views</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
              isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{displayVideo.likes || 0}</span>
          </button>
        </div>
      </div>

      {/* Channel Info Section */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={displayVideo.owner?.avatar || 'https://via.placeholder.com/48'}
              alt={displayVideo.owner?.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-lg">{displayVideo.owner?.username}</h3>
              <p className="text-sm text-gray-600">{displayVideo.owner?.subscribersCount || 0} subscribers</p>
            </div>
          </div>
          {authToken && (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-medium transition ${
                isSubscribed
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
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
              {displayVideo.description || 'No description available.'}
            </p>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>
        
        {authToken && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-2">
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
            <Comment
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              authToken={authToken}
              onUpdate={fetchComments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMMENT COMPONENT - Individual comment with edit/delete for owner
// ============================================================================

function Comment({ comment, currentUser, authToken, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const isOwner = currentUser && currentUser._id === comment.owner?._id;

  const handleUpdate = async () => {
    try {
      await api.updateComment({ commentId: comment._id, content: editedContent }, authToken);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.deleteComment(comment._id, authToken);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="flex space-x-3">
      <img
        src={comment.owner?.avatar || 'https://via.placeholder.com/40'}
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm">{comment.owner?.username}</span>
          <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              rows="2"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700">{comment.content}</p>
            {isOwner && (
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PROFILE PAGE COMPONENT - User profile with stats and edit functionality
// ============================================================================

function ProfilePage({ authToken, currentUser }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '' });

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const response = await api.getChannelProfile(currentUser.username, authToken);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setFormData({
          fullName: data.data.fullName || '',
          email: data.data.email || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.updateUserDetails(formData, authToken);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cover Image Section */}
        <div className="h-48 bg-gradient-to-r from-red-500 to-pink-500">
          {profile.coverImage && (
            <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <img
              src={profile.avatar || 'https://via.placeholder.com/120'}
              alt={profile.username}
              className="w-24 h-24 rounded-full border-4 border-white -mt-12"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-600">{profile.fullName}</p>
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
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{profile.subscribersCount || 0}</p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <PlaySquare className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold">{profile.subscribedToCount || 0}</p>
              <p className="text-sm text-gray-600">Subscribed To</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TWEETS PAGE COMPONENT - Display and manage user tweets
// ============================================================================

function TweetsPage({ authToken, currentUser }) {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await api.getUserTweets(authToken);
      if (response.ok) {
        const data = await response.json();
        setTweets(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
  };

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) return;
    try {
      await api.createTweet({ content: newTweet }, authToken);
      setNewTweet('');
      fetchTweets();
    } catch (error) {
      console.error('Failed to create tweet:', error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!confirm('Delete this tweet?')) return;
    try {
      await api.deleteTweet(tweetId, authToken);
      fetchTweets();
    } catch (error) {
      console.error('Failed to delete tweet:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Tweets</h1>

      {/* Create Tweet Section */}
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

      {/* Tweets List Section */}
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex space-x-3 flex-1">
                <img
                  src={currentUser?.avatar || 'https://via.placeholder.com/48'}
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
              <button
                onClick={() => handleDeleteTweet(tweet._id)}
                className="text-red-600 hover:text-red-800"
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

// ============================================================================
// LIKED VIDEOS PAGE COMPONENT - Display user's liked videos
// ============================================================================

function LikedVideosPage({ authToken, onVideoSelect }) {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      const response = await api.getLikedVideos(authToken);
      if (response.ok) {
        const data = await response.json();
        setLikedVideos(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <Heart className="w-8 h-8 text-red-600" />
        <span>Liked Videos</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likedVideos.map((video) => (
          <VideoCard key={video._id} video={video} onClick={() => onVideoSelect(video)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PLAYLISTS PAGE COMPONENT - Display and manage user playlists
// ============================================================================

function PlaylistsPage({ authToken }) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.getUserPlaylists(authToken);
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) return;
    try {
      await api.createPlaylist(newPlaylist, authToken);
      setNewPlaylist({ name: '', description: '' });
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <List className="w-8 h-8 text-red-600" />
          <span>Your Playlists</span>
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Create Playlist Form Section */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Name</label>
              <input
                type="text"
                value={newPlaylist.name}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                rows="3"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreatePlaylist}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlists Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="h-40 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <List className="w-16 h-16 text-white opacity-50" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{playlist.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{playlist.description}</p>
              <p className="text-sm text-gray-500 mt-2">{playlist.videos?.length || 0} videos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// LOGIN PAGE COMPONENT - User authentication form
// ============================================================================

function LoginPage({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.login(formData);
      const data = await response.json();
      if (response.ok) {
        onLogin(data.data.accessToken);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <PlaySquare className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// REGISTER PAGE COMPONENT - New user registration form
// ============================================================================

function RegisterPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (avatar) data.append('avatar', avatar);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      const response = await api.register(data);
      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <PlaySquare className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join VideoTube today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}