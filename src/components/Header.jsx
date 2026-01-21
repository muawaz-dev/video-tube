// ============================================================================
// HEADER COMPONENT - Top navigation bar with search and user actions
// ============================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Menu,PlaySquare,Search,LogOut} from 'lucide-react'
import { api } from "../utils/api.js";
import requestHandler from "../utils/requestHandler.js";
function Header({ currentUser,setCurrentUser, setSidebarOpen, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()

  async function logoutHandler(){
    try {
        await requestHandler(api.logout)
        setCurrentUser(null)
    } catch (error) {
      console.log("Something went wrong",error)
    }
  }

  function handleSearchClick(){
    navigate(`/${searchQuery}`)
  }

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
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
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
            <button 
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
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
                  src={currentUser.avatar?.secure_url}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-sm">{currentUser.username}</span>
              </div>
              <button
                onClick={logoutHandler}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
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

export default Header