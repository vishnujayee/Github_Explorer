import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Database } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import { SearchResults } from '../components/SearchResults';

export const DashboardPage = () => {
  const { 
    fetchStoredResults, 
    searchResults, 
    loading, 
    error, 
    pagination,
    stats 
  } = useSearch();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('searchTimestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchStoredResults(currentPage, 20, searchKeyword);
  }, [currentPage, searchKeyword, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStoredResults(1, 20, searchKeyword);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Search Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View all stored search results and manage your search history. 
          Data is automatically saved from your searches on the main page.
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalSearches}</div>
              <div className="text-blue-100">Total Searches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.uniqueKeywords}</div>
              <div className="text-blue-100">Unique Keywords</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalResults}</div>
              <div className="text-blue-100">Total Results</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.avgProcessingTime}ms</div>
              <div className="text-blue-100">Avg Response Time</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search by Keyword */}
          <div>
            <form onSubmit={handleSearch} className="space-y-3">
              <label htmlFor="searchKeyword" className="block text-sm font-medium text-gray-700">
                Search by Keyword
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="searchKeyword"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Enter keyword to filter results..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Sort Options */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="searchTimestamp">Search Date</option>
              <option value="keyword">Keyword</option>
              <option value="totalCount">Total Results</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Results */}
      {searchResults.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Stored Search Results
            </h2>
            <div className="text-sm text-gray-500">
              {pagination.total} total results
            </div>
          </div>

          {/* Search History List */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Search History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <div key={result._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Database className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Keyword: <span className="font-semibold">{result.keyword}</span>
                          </h4>
                          <p className="text-sm text-gray-500">
                            {result.results ? result.results.length : 0} repositories found • 
                            Total: {result.totalCount} • 
                            Processing: {result.processingTime}ms
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(result.searchTimestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Database className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stored results found</h3>
          <p className="text-gray-500">
            {searchKeyword 
              ? `No results found for "${searchKeyword}". Try a different keyword or search on the main page.`
              : 'No search results have been stored yet. Go to the main page to search for repositories.'
            }
          </p>
        </div>
      )}
    </div>
  );
};