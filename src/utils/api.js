// ============================================================================
// UTILITY FUNCTIONS & API SERVICE
// ============================================================================

const API_BASE_URL = '/api';

const api = {
  // Auth endpoints
  register: (formData) => fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    body: formData
  }),
  login: (data) => fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  logout: () => fetch(`${API_BASE_URL}/users/logout`, {
    method: 'POST'
  }),

  renewTokens: () => fetch(`${API_BASE_URL}/users/renew-tokens`, {
    method: "POST"
  }),

  // Video endpoints
  getAllVideos: ({params}) => fetch(`${API_BASE_URL}/videos/all-videos${params && "?"+new URLSearchParams(params)}`),
  getVideoById: (videoId) => fetch(`${API_BASE_URL}/videos/video/${videoId}`),
  incrementView: (videoId) => fetch(`${API_BASE_URL}/videos/increment-view/${videoId}`, {
    method: 'POST'
  }),
  uploadVideo: (data) => fetch(`${API_BASE_URL}/videos/upload-video`, {
    method: "POST",
    body: data
  }),
  updateVideoDetails: (data) => fetch(`${API_BASE_URL}/videos/update-video`, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateThumbnail: (data) => fetch(`${API_BASE_URL}/videos/update-thumbnail/${data.videoId}`, {
    method: "PATCH",
    body: data.form
  }),
  deleteVideo: (videoId) => fetch(`${API_BASE_URL}/videos/delete-video/${videoId}`, {
    method: "DELETE"
  }),


  getUserVideos: () => fetch(`${API_BASE_URL}/videos/user-videos`),

  // User endpoints
  getCurrentUser: () => fetch(`${API_BASE_URL}/users/current-user`),

  getChannelProfile: (username) => fetch(`${API_BASE_URL}/users/channel-profile/${username}`),
  getWatchHistory: () => fetch(`${API_BASE_URL}/users/watch-history`),
  updateUserDetails: (data) => fetch(`${API_BASE_URL}/users/update-details`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateUserAvatar: (data) => fetch(`${API_BASE_URL}/users/update-avatar`, {
    method: 'PATCH',
    body: data
  }),
  updateUserCoverImage: (data) => fetch(`${API_BASE_URL}/users/update-coverImage`, {
    method: 'PATCH',
    body: data
  }),
  pushWatchHistory: (videoId) => fetch(`${API_BASE_URL}/users/push-watch-history/${videoId}`, {
    method: "POST"
  }),

  // Like endpoints
  toggleVideoLike: (videoId) => fetch(`${API_BASE_URL}/likes/video-like/${videoId}`, {
    method: 'PUT'
  }),
  getLikedVideos: () => fetch(`${API_BASE_URL}/likes/liked-videos`),

  // Comment endpoints
  getVideoComments: (videoId) => fetch(`${API_BASE_URL}/comments/video-comments/${videoId}`),
  addComment: (data) => fetch(`${API_BASE_URL}/comments/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateComment: (data) => fetch(`${API_BASE_URL}/comments/update/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteComment: (commentId) => fetch(`${API_BASE_URL}/comments/delete/${commentId}`, {
    method: 'DELETE'
  }),

  // Subscription endpoints
  toggleSubscription: (channelId) => fetch(`${API_BASE_URL}/subscriptions/toggle-subscription/${channelId}`, {
    method: 'PUT'
  }),
  subscribedTo: () => fetch(`${API_BASE_URL}/subscriptions/subscribed-to`),
  subscribers: () => fetch(`${API_BASE_URL}/subscriptions/subscribers`),
  

  // Tweet endpoints
  getUserTweets: () => fetch(`${API_BASE_URL}/tweets/user-tweets`),
  getAllTweets: () => fetch(`${API_BASE_URL}/tweets/all-tweets`),
  createTweet: (data) => fetch(`${API_BASE_URL}/tweets/create-tweet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateTweet: (data) => fetch(`${API_BASE_URL}/tweets/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteTweet: (tweetId) => fetch(`${API_BASE_URL}/tweets/delete/${tweetId}`, {
    method: 'DELETE'
  }),

  // Playlist endpoints
  getUserPlaylists: () => fetch(`${API_BASE_URL}/playlists/user-playlists`),
  createPlaylist: (data) => fetch(`${API_BASE_URL}/playlists/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deletePlaylist: (playlistId) => fetch(`${API_BASE_URL}/playlists/delete/${playlistId}`,{
    method:"DELETE"
  }),
  addVideosToPlaylist: (data) => fetch(`${API_BASE_URL}/playlists/add-videos`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  removeVideoFromPlaylist: (data) => fetch(`${API_BASE_URL}/playlists/remove-video`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  getPlaylistById: (playlistId) => fetch(`${API_BASE_URL}/playlists/playlist/${playlistId}`),
};

export { api }