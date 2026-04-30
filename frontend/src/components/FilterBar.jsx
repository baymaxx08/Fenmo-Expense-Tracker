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
          <select
            value={selectedCategory || 'All'}
            onChange={(e) => onCategoryChange(e.target.value === 'All' ? null : e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            {displayCategories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
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
