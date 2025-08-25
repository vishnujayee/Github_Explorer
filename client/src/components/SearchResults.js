import React from 'react';

export const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

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

  return (
    <div className="grid grid-cols-1 gap-6">
      {results.map((repo) => (
        <div key={repo.id} className="border rounded-lg p-4 flex space-x-4">
          {/* Owner avatar */}
          <div className="flex-shrink-0">
            <img
              src={repo.owner?.avatarUrl || 'default-avatar.png'}
              alt={repo.owner?.login || 'Owner'}
              className="w-12 h-12 rounded-full"
            />
          </div>
          {/* Repository details */}
          <div className="flex-1">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-blue-600 hover:underline"
            >
              {repo.fullName || 'No Title'}
            </a>
            {repo.description && (
              <p className="text-gray-600 mt-1">{repo.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              {repo.stargazersCount != null && (
                <span>⭐ {formatNumber(repo.stargazersCount)}</span>
              )}
              {repo.forksCount != null && (
                <span>🍴 {formatNumber(repo.forksCount)}</span>
              )}
              {repo.openIssuesCount != null && (
                <span>🐛 {formatNumber(repo.openIssuesCount)} Issues</span>
              )}
              {repo.language && <span>{repo.language}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};