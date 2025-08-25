const express = require('express');
const axios = require('axios');
const SearchResult = require('../models/SearchResult');
const router = express.Router();

// Search GitHub repositories
router.post('/github', async (req, res) => {
  try {
    const { keyword, page = 1, perPage = 30 } = req.body;
    
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const startTime = Date.now();
    
    // GitHub API endpoint
    const githubApiUrl = 'https://api.github.com/search/repositories';
    const params = {
      q: keyword.trim(),
      page: parseInt(page),
      per_page: Math.min(parseInt(perPage), 100),
      sort: 'stars',
      order: 'desc'
    };

    // Make request to GitHub API
    const response = await axios.get(githubApiUrl, { 
      params,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'API-Mini-App'
      },
      timeout: 10000
    });

    const processingTime = Date.now() - startTime;

    // Transform GitHub API response
    const transformedResults = response.data.items.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description available',
      htmlUrl: repo.html_url,
      stargazersCount: repo.stargazers_count,
      language: repo.language || 'Unknown',
      forksCount: repo.forks_count,
      openIssuesCount: repo.open_issues_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
        htmlUrl: repo.owner.html_url
      }
    }));

    // Save to database
    const query = {
      keyword: keyword.trim(),
      searchType: 'github_repos',
      page: parseInt(page),
      perPage: Math.min(parseInt(perPage), 100)
    };

    const update = {
      results: transformedResults,
      totalCount: response.data.total_count,
      processingTime,
      // Let Mongoose update the timestamps (if you’re using timestamps in your schema)
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const savedResult = await SearchResult.findOneAndUpdate(query, update, options);

    res.json({
      success: true,
      data: {
        keyword: keyword.trim(),
        results: savedResult.results,
        totalCount: savedResult.totalCount,
        page: savedResult.page,
        perPage: savedResult.perPage,
        processingTime: savedResult.processingTime,
        savedToDb: true
      }
    });

  } catch (error) {
    console.error('GitHub search error:', error);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: error.response.headers['retry-after'] || 60
        });
      } else if (status === 422) {
        return res.status(400).json({ 
          error: 'Invalid search query. Please check your keyword.',
          details: error.response.data.message
        });
      } else {
        return res.status(status).json({ 
          error: 'GitHub API error',
          details: error.response.data.message
        });
      }
    } else if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: 'Request timeout. Please try again.' 
      });
    } else {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
});

// Get search history for a keyword
router.get('/history/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const searchHistory = await SearchResult.find({ 
      keyword: { $regex: keyword, $options: 'i' } 
    })
    .sort({ searchTimestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

    const total = await SearchResult.countDocuments({ 
      keyword: { $regex: keyword, $options: 'i' } 
    });

    res.json({
      success: true,
      data: {
        keyword,
        history: searchHistory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch search history',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;