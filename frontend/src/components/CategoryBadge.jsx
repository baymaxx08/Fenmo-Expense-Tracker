import React from 'react';

/**
 * Category badge component
 * Displays category with a consistent color
 */
export function CategoryBadge({ category }) {
  const getCategoryColor = (cat) => {
    const colors = {
      'Food': 'bg-orange-100 text-orange-800',
      'Transport': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Health': 'bg-green-100 text-green-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
      {category}
    </span>
  );
}
