import React, { useState, useEffect } from 'react';
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

      <RouterProvider router={router}></RouterProvider>

    </>
  );
}


export default App








