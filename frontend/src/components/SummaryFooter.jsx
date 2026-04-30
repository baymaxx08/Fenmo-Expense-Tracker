import React from 'react';
import { formatCurrency } from '../utils/money.js';
import { CategoryBadge } from './CategoryBadge.jsx';

/**
 * Summary Footer component
 * Shows total and category breakdown
 */
export function SummaryFooter({ expenses, categoryTotals }) {
  const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-t-4 border-indigo-600">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>

      {/* Total */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-4">
        <p className="text-gray-600 text-sm mb-1">Total Expenses</p>
        <p className="text-3xl font-bold text-indigo-600">{formatCurrency(total)}</p>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">By Category</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div
                key={category}
                className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
              >
                <CategoryBadge category={category} />
                <span className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
