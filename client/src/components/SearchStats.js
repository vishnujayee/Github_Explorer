import React from 'react';
import { BarChart3, Search, Database, Clock, ChevronUp, ChevronDown } from 'lucide-react';

export const SearchStats = ({ stats, isOpen, onToggle }) => {
  // Use default values if stats is null or properties are missing
  const totalSearches = typeof stats?.totalSearches === 'number' ? stats.totalSearches : 0;
  const uniqueKeywords = typeof stats?.uniqueKeywords === 'number' ? stats.uniqueKeywords : 0;
  const totalResults = typeof stats?.totalResults === 'number' ? stats.totalResults : 0;
  const avgProcessingTime = typeof stats?.avgProcessingTime === 'number' ? stats.avgProcessingTime : 0;

  const formatNumber = (num) => {
    if (typeof num !== 'number') {
      return 'N/A';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (ms) => {
    if (typeof ms !== 'number' || ms <= 0) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Application Statistics
            </h3>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Searches */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalSearches)}
            </div>
            <div className="text-sm text-gray-600">Total Searches</div>
          </div>

          {/* Unique Keywords */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(uniqueKeywords)}
            </div>
            <div className="text-sm text-gray-600">Unique Keywords</div>
          </div>

          {/* Total Results */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(totalResults)}
            </div>
            <div className="text-sm text-gray-600">Total Results</div>
          </div>

          {/* Average Response Time */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(avgProcessingTime)}
            </div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-center text-sm text-gray-600">
            <p>
              Data is automatically stored in MongoDB and can be viewed on the{' '}
              <a href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
                Dashboard page
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};