import React, { useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

export const SearchForm = () => {
  const [keyword, setKeyword] = useState('');
  const [perPage, setPerPage] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { searchGitHub, loading } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      searchGitHub(keyword.trim(), 1, perPage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for GitHub repositories (e.g., 'react', 'nodejs', 'machine learning')"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            disabled={loading}
          />
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="perPage" className="block text-sm font-medium text-gray-700 mb-2">
                  Results per page
                </label>
                <select
                  id="perPage"
                  value={perPage}
                  onChange={(e) => setPerPage(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={30}>30 results</option>
                  <option value={50}>50 results</option>
                  <option value={100}>100 results</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Search Tips:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Use quotes for exact phrases</li>
                    <li>• Add "language:javascript" for specific languages</li>
                    <li>• Use "stars:&gt;1000" for popular repos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!keyword.trim() || loading}
            className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition-colors ${
              !keyword.trim() || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Repositories
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 