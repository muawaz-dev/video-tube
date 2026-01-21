
// ============================================================================
// PLAYLISTS PAGE COMPONENT - Display and manage user playlists
// ============================================================================
import { api } from "../../utils/api.js";
import { useState, useEffect } from "react";
import { List, Plus, Trash2 } from 'lucide-react'
import requestHandler from "../../utils/requestHandler.js";
import { useNavigate } from "react-router-dom";
function PlaylistsPage({ currentUser }) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const navigate = useNavigate()
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const result = await requestHandler(api.getUserPlaylists)
      setPlaylists(result.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.name.trim()) return;
    try {
      await requestHandler(api.createPlaylist, newPlaylist)
      setNewPlaylist({ name: '', description: '' });
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist-videos/${playlistId}`)
  }

  const handlePlaylistDelete = async (playlistId)=>{
    try {
      await requestHandler(api.deletePlaylist,playlistId)
      setPlaylists(playlists.filter((playlist)=>playlist._id!==playlistId))
    } catch (error) {
      console.log("Could not delete playlist,Error:",error)
    }
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
          <div className="flex flex-col gap-2">
          <div onClick={() => handlePlaylistClick(playlist._id)} key={playlist._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="h-40 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <List className="w-16 h-16 text-white opacity-50" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{playlist.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{playlist.description}</p>
              <p className="text-sm text-gray-500 mt-2">{playlist.videos?.length || 0} videos</p>
            </div>
          </div>
            <button
              onClick={()=>handlePlaylistDelete(playlist._id)}
              className="px-6 mb-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 m-auto flex justify-center"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistsPage
