// ============================================================================
// SIDEBAR COMPONENT - Navigation menu with Home, Profile, Tweets sections
// ============================================================================
import { Home, User, MessageSquare, Film,List,Heart } from 'lucide-react';
import {NavLink} from 'react-router-dom'
function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/tweets', label: 'Tweets', icon: MessageSquare },
    { id: '/profile', label: 'Profile', icon: User },
    { id: '/liked-videos', label: 'Liked Videos', icon: Heart },
    { id: '/playlists', label: 'Playlists', icon: List },
    { id: '/upload-video', label: 'Upload Video', icon: Film },
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
              <NavLink
                key={item.id}
                to={item.id}
                className={({isActive})=>`inline-block w-full flex items-center space-x-3 px-4 py-3
                   rounded-lg transition ${isActive?'bg-red-50 text-red-600':'hover:bg-gray-100 text-gray-700'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar