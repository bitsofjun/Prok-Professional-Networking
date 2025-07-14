import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-purple-600 to-teal-400 shadow-lg backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-extrabold text-white tracking-wide font-poppins drop-shadow-lg">ProkNet</span>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/feed" className="nav-link">Feed</Link>
          <Link to="/posts/create" className="nav-link">Posts</Link>
          <Link to="/messages" className="nav-link">Messages</Link>
        </div>
      </div>
      <style>
        {`
          .nav-link {
            @apply text-white font-medium px-3 py-2 rounded transition-all duration-200;
          }
          .nav-link:hover, .nav-link:focus {
            @apply bg-white bg-opacity-20 shadow-md scale-105;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar; 