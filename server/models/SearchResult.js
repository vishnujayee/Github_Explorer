const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  searchType: {
    type: String,
    default: 'github_repos',
    enum: ['github_repos', 'github_users', 'other']
  },
  results: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    fullName: String,
    description: String,
    htmlUrl: String,
    stargazersCount: Number,
    language: String,
    forksCount: Number,
    openIssuesCount: Number,
    createdAt: String,
    updatedAt: String,
    owner: {
      login: String,
      avatarUrl: String,
      htmlUrl: String
    }
  }],
  totalCount: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 30
  },
  searchTimestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
searchResultSchema.index({ keyword: 1, searchTimestamp: -1 });
searchResultSchema.index({ searchTimestamp: -1 });

// Virtual for formatted date
searchResultSchema.virtual('formattedDate').get(function() {
  return this.searchTimestamp.toLocaleDateString();
});

// Ensure virtual fields are serialized
searchResultSchema.set('toJSON', { virtuals: true });
searchResultSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('SearchResult', searchResultSchema); 