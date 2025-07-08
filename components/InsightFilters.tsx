import React, { useState, useEffect } from 'react';
import { AIResource } from '../types';

interface FilterState {
  search: string;
  tags: string[];
  sources: string[];
  trendingScore: number;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface InsightFiltersProps {
  articles: AIResource[];
  onFilterChange: (filteredArticles: AIResource[]) => void;
}

const InsightFilters: React.FC<InsightFiltersProps> = ({ articles, onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    sources: [],
    trendingScore: 0,
    dateRange: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique tags and sources from articles
  const uniqueTags = [...new Set(articles.flatMap(article => article.tags))].sort();
  const uniqueSources = [...new Set(articles.map(article => article.sourceName))].sort();

  // Filter articles based on current filters
  useEffect(() => {
    let filtered = articles;

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(article => 
        filters.tags.some(tag => article.tags.includes(tag))
      );
    }

    // Sources filter
    if (filters.sources.length > 0) {
      filtered = filtered.filter(article => 
        filters.sources.includes(article.sourceName)
      );
    }

    // Trending score filter
    if (filters.trendingScore > 0) {
      filtered = filtered.filter(article => 
        article.trendingScore >= filters.trendingScore / 100
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(article => 
        new Date(article.createdAt) >= cutoff
      );
    }

    onFilterChange(filtered);
  }, [articles, filters, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSourceToggle = (source: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      sources: [],
      trendingScore: 0,
      dateRange: 'all'
    });
  };

  const hasActiveFilters = filters.search || filters.tags.length > 0 || filters.sources.length > 0 || filters.trendingScore > 0 || filters.dateRange !== 'all';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center">
          <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3"></span>
          Filter Insights
        </h3>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg bg-gray-700/50 hover:bg-gray-600/50"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search insights..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Always visible filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterState['dateRange'] }))}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Trending Score */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Trending Score: {filters.trendingScore}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.trendingScore}
            onChange={(e) => setFilters(prev => ({ ...prev, trendingScore: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Expandable advanced filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-700/50">
          {/* Tags Filter */}
          {uniqueTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sources Filter */}
          {uniqueSources.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sources</label>
              <div className="flex flex-wrap gap-2">
                {uniqueSources.map(source => (
                  <button
                    key={source}
                    onClick={() => handleSourceToggle(source)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      filters.sources.includes(source)
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Showing {articles.length} insights
            </span>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-400">Filters Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightFilters;