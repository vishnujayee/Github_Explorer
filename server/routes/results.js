const express = require('express');
const SearchResult = require('../models/SearchResult');
const router = express.Router();

// Get all stored search results with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword, sortBy = 'searchTimestamp', sortOrder = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};
    if (keyword) {
      query.keyword = { $regex: keyword, $options: 'i' };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const results = await SearchResult.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await SearchResult.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch results',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get recent searches
router.get('/recent/searches', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Sort documents so that $first will pick the most recent document
    const recentSearches = await SearchResult.aggregate([
      { $sort: { searchTimestamp: -1 } },
      {
        $group: {
          _id: '$keyword',
          lastSearch: { $max: '$searchTimestamp' },
          totalSearches: { $sum: 1 },
          latestResult: { $first: '$$ROOT' }
        }
      },
      { $sort: { lastSearch: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.json({
      success: true,
      data: recentSearches
    });
    
  } catch (error) {
    console.error('Get recent searches error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent searches',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalSearches = await SearchResult.countDocuments();
    const uniqueKeywords = (await SearchResult.distinct('keyword')).length;
    
    const totalResults = await SearchResult.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalCount' }
        }
      }
    ]);
    
    const avgProcessingTime = await SearchResult.aggregate([
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$processingTime' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalSearches,
        uniqueKeywords,
        totalResults: totalResults[0]?.total || 0,
        avgProcessingTime: Math.round(avgProcessingTime[0]?.avgTime || 0)
      }
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Get a specific search result by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SearchResult.findById(id).select('-__v');
    
    if (!result) {
      return res.status(404).json({ error: 'Search result not found' });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Get result by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch result',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;