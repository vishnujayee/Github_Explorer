import React, { useEffect, useState } from 'react';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { SearchStats } from '../components/SearchStats';
import { useSearch } from '../contexts/SearchContext';

export const SearchPage = () => {
  const {
    searchResults = [],
    loading,
    error,
    currentSearch,
    stats,
    resetSearch
  } = useSearch();
  const [showStats, setShowStats] = useState(true);

  // When SearchPage mounts, clear any stale data
  useEffect(() => {
    resetSearch();
  }, [resetSearch]);

  // Check if a search has been initiated
  const hasSearched = currentSearch && currentSearch.trim() !== '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          GitHub Repository Explorer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search for GitHub repositories by keyword. Results are automatically stored in our database and can be viewed on the dashboard page.
        </p>
      </div>

      {/* Search Form */}
      <SearchForm />

      {/* Statistics Section */}
      {showStats && stats && (
        <SearchStats
          stats={stats}
          onToggle={() => setShowStats(!showStats)}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !loading && !error && searchResults && searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results for "{currentSearch}"
            </h2>
            <div className="text-sm text-gray-500">
              {searchResults.length} repositories found
            </div>
          </div>
          <SearchResults results={searchResults} />
        </div>
      )}

      {/* No Results Found */}
      {hasSearched && !loading && !error && ( !searchResults || searchResults.length === 0 ) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories found</h3>
          <p className="text-gray-500">Try adjusting your search terms or check the spelling.</p>
        </div>
      )}

      {/* Initial Prompt (Before any search is made) */}
      {!hasSearched && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
          <p className="text-gray-500">Enter a keyword above to search for GitHub repositories.</p>
        </div>
      )}
    </div>
  );
};