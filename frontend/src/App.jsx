import React, { useState } from 'react';
import { AddExpenseForm } from './components/AddExpenseForm.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { ExpenseTable } from './components/ExpenseTable.jsx';
import { SummaryFooter } from './components/SummaryFooter.jsx';
import { Toast } from './components/Toast.jsx';
import { useExpenses } from './hooks/useExpenses.js';

function App() {
  const {
    expenses,
    categories,
    loadedCategories,
    selectedCategory,
    sort,
    isLoading,
    error,
    addExpense,
    updateFilters,
    calculateTotal,
    calculateCategoryTotals,
  } = useExpenses();

  const [toastVisible, setToastVisible] = useState(false);

  const handleExpenseAdded = (newExpense) => {
    addExpense(newExpense);
    setToastVisible(true);
  };

  const handleCategoryChange = (category) => {
    updateFilters(category, sort);
  };

  const handleSortChange = (newSort) => {
    updateFilters(selectedCategory, newSort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">💰 Expense Tracker</h1>
          <p className="text-gray-600 text-sm mt-1">Track your spending and manage your budget</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Add Expense Form */}
        <AddExpenseForm onExpenseAdded={handleExpenseAdded} categories={categories} />

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          sort={sort}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          loadedCategories={loadedCategories}
        />

        {/* Expense Table */}
        <ExpenseTable expenses={expenses} isLoading={isLoading} />

        {/* Summary Footer */}
        {expenses.length > 0 && (
          <SummaryFooter
            expenses={expenses}
            categoryTotals={calculateCategoryTotals()}
          />
        )}
      </main>

      {/* Toast Notification */}
      <Toast
        message="Expense added successfully!"
        type="success"
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </div>
  );
}

export default App;
