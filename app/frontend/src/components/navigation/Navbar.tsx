import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
            <Link to="/feed" className="text-gray-700 hover:text-blue-600 font-medium">Feed</Link>
            <Link to="/posts/create" className="text-gray-700 hover:text-blue-600 font-medium">Posts</Link>
            <Link to="/messages" className="text-gray-700 hover:text-blue-600 font-medium">Messages</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 