import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import axios from 'axios';

const SearchContext = createContext();

const initialState = {
    searchResults: [],
    loading: false,
    error: null,
    currentSearch: null,
    searchHistory: [],
    stats: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SEARCH_RESULTS':
      return { 
        ...state, 
        searchResults: action.payload.results,
        currentSearch: action.payload.keyword,
        pagination: action.payload.pagination || state.pagination,
        loading: false,
        error: null
      };
    case 'SET_SEARCH_HISTORY':
      return { ...state, searchHistory: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_SEARCH':
      return { 
        ...state, 
        searchResults: [],
        currentSearch: null,
        error: null
      };
    default:
      return state;
  }
};

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Memoize the API_BASE so it's computed only once
  const API_BASE = useMemo(() => {
    return (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
  }, []);

  useEffect(() => {
    console.log('Using API_BASE:', API_BASE);
  }, [API_BASE]);

  // Search GitHub repositories
  const searchGitHub = async (keyword, page = 1, perPage = 30) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      // Send keyword, page, and perPage in the request body
      const response = await axios.post(`${API_BASE}/search/github`, { 
        keyword, 
        page, 
        perPage 
      }, {
        headers: {
          // Optionally add your GitHub token if needed:
          // 'Authorization': `token YOUR_GITHUB_TOKEN`
        }
      });

      // Expecting server response data structure: 
      // { success: true, data: { keyword, results, totalCount, ... } }
      dispatch({
        type: 'SET_SEARCH_RESULTS',
        payload: {
          results: response.data.data.results,
          keyword: response.data.data.keyword,
          pagination: {
            total: response.data.data.totalCount,
            page,
            perPage,
            pages: Math.ceil(response.data.data.totalCount / perPage)
          }
        }
      });

      // Fetch updated stats if needed
      fetchStats();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during search';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Fetch search history
  const fetchSearchHistory = async (keyword, page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE}/search/history/${encodeURIComponent(keyword)}`, {
        params: { page, limit }
      });

      if (response.data.success) {
        dispatch({ 
          type: 'SET_SEARCH_HISTORY', 
          payload: response.data.data.history 
        });
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  // Fetch stored results
  const fetchStoredResults = async (page = 1, limit = 20, keyword = '') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await axios.get(`${API_BASE}/results`, {
        params: { page, limit, keyword }
      });

      if (response.data.success) {
        dispatch({ 
          type: 'SET_SEARCH_RESULTS', 
          payload: {
            results: response.data.data.results,
            keyword: keyword || 'All Results',
            pagination: response.data.data.pagination
          }
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch results';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/results/stats/overview`);
      
      if (response.data.success) {
        dispatch({ type: 'SET_STATS', payload: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Reset search
  const resetSearch = () => {
    dispatch({ type: 'RESET_SEARCH' });
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const value = {
    ...state,
    searchGitHub,
    fetchSearchHistory,
    fetchStoredResults,
    fetchStats,
    clearError,
    resetSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};