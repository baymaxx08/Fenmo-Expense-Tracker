import React from 'react';
import { CategoryBadge } from './CategoryBadge.jsx';
import { formatCurrency } from '../utils/money.js';
import { LoadingSkeleton } from './LoadingSkeleton.jsx';

/**
 * Expense Table/List component
 */
export function ExpenseTable({ expenses, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <LoadingSkeleton />
          </tbody>
        </table>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start tracking your expenses by adding one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">{expense.date}</td>
              <td className="px-6 py-4">
                <CategoryBadge category={expense.category} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
              <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
