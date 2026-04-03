import React, { useState, useEffect } from 'react';
import { X, AlertCircle, ExternalLink } from 'lucide-react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Layout from './pages/main/Layout.jsx';
import HomePage from './pages/main/Home.jsx';
import LoginPage from './pages/auth/Login.jsx';
import RegisterPage from './pages/auth/Register.jsx';
import PlaylistsPage from './pages/playlist/Playlists.jsx'
import MyTweetsPage from './pages/profile/MyTweets.jsx';
import TweetsPage from './pages/tweet/Tweets.jsx'
import VideoPage from './pages/video/Video.jsx';
import EditVideoPage from './pages/video/EditVideo.jsx';
import LikedVideosPage from './pages/video/LikedVideos.jsx';
import UploadVideoPage from './pages/video/UploadVideo.jsx';
import ProfilePage from './pages/profile/Profile.jsx';
import WatchHistoryPage from './pages/profile/WatchHistory.jsx';
import { api } from './utils/api.js';
import requestHandler from './utils/requestHandler.js';
import MyVideosPage from './pages/profile/MyVideos.jsx';
import PlaylistVideosPage from './pages/playlist/PlaylistVideos.jsx';
import SubscriptionsPage from './pages/profile/Subscriptions.jsx';
import SubscribersPage from './pages/profile/Subscribers.jsx';
import ChannelProfilePage from './pages/channel/ChannelProfile.jsx';
// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification on mount
    setShowNotification(true);
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const result = await requestHandler(api.getCurrentUser)
        setCurrentUser(result.data)
      } catch (error) {
        console.log("An error occured:", error)
      }
    })();
  }, [])
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path='/' element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />} >
        <Route index element={<HomePage />} />
        <Route path=':searchQuery' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path='/profile' element={<ProfilePage currentUser={currentUser} />} />
        <Route path='/channel/:username' element={<ChannelProfilePage currentUser={currentUser} />} />
        <Route path='/watch-history' element={<WatchHistoryPage currentUser={currentUser} />} />
        <Route path='/my-tweets' element={<MyTweetsPage currentUser={currentUser} />} />
        <Route path='/my-videos' element={<MyVideosPage currentUser={currentUser} />} />
        <Route path='/subscriptions' element={<SubscriptionsPage currentUser={currentUser} />} />
        <Route path='/subscribers' element={<SubscribersPage currentUser={currentUser} />} />
        <Route path='/tweets' element={<TweetsPage currentUser={currentUser} />} />
        <Route path='/playlists' element={<PlaylistsPage currentUser={currentUser} />} />
        <Route path='/playlist-videos/:_id' element={<PlaylistVideosPage currentUser={currentUser} />} />
        <Route path='/upload-video' element={<UploadVideoPage currentUser={currentUser} />} />
        <Route path='/edit-video/:_id' element={<EditVideoPage currentUser={currentUser} />} />
        <Route path='/video/:_id' element={<VideoPage currentUser={currentUser} />} />
        <Route path='/liked-videos' element={<LikedVideosPage currentUser={currentUser} />} />
      </Route>
    </>
  ))

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[1000] p-4 flex justify-center transition-all duration-500 ease-in-out transform ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-2xl w-full">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium leading-relaxed">
              The backend server is not live. Most interactive features will be unavailable. Check out the full working on LinkedIn post.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/feed/update/urn:li:activity:7421741940204855296/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </a>
            <button 
              onClick={() => setShowNotification(false)}
              className="hover:bg-zinc-800 p-2 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <RouterProvider router={router}></RouterProvider>

    </>
  );
}


export default App








