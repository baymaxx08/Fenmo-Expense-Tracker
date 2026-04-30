import React from 'react';

/**
 * Filter Bar component
 * Allows filtering by category and sorting
 */
export function FilterBar({ 
  categories, 
  selectedCategory, 
  sort, 
  onCategoryChange, 
  onSortChange,
  loadedCategories,
}) {
  const displayCategories = ['All', ...loadedCategories];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory || 'All'}
              onChange={(e) => onCategoryChange(e.target.value === 'All' ? null : e.target.value)}
              className="w-full px-4 py-2.5 pr-10 border-2 border-gray-200 rounded-lg appearance-none bg-white cursor-pointer transition-all font-medium hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
            >
              {displayCategories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onSortChange('date_desc')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'date_desc'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => onSortChange('date_asc')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'date_asc'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Oldest First
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
