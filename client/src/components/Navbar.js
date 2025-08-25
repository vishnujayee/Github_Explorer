import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart3, Github } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <Github className="h-8 w-8" />
            <span>GitHub Explorer</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Right side - could add user info, settings, etc. */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              API Mini App
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 