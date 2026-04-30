import { useState, useEffect, useCallback } from 'react';
import { fetchExpenses, fetchCategories } from '../api/expenses.js';

/**
 * Custom hook for managing expenses state, fetching, filtering, and sorting
 */
export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Other']);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sort, setSort] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch expenses on mount and when filters change
  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await fetchExpenses(selectedCategory, sort);

    if (error) {
      setError(error);
      setExpenses([]);
    } else {
      // Filter by date if selected
      let filteredData = data || [];
      if (selectedDate) {
        filteredData = filteredData.filter(exp => exp.date === selectedDate);
      }
      
      setExpenses(filteredData);
      // Extract unique categories from loaded data
      const uniqueCats = [...new Set(filteredData.map(exp => exp.category))].sort();
      setLoadedCategories(uniqueCats);
    }

    setIsLoading(false);
  }, [selectedCategory, selectedDate, sort]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Fetch preset categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      // Categories are preset, no need to fetch from API
      // But we keep this for future extensibility
    };
    loadCategories();
  }, []);

  const addExpense = useCallback((newExpense) => {
    // Add to the front of the list if it matches current filters
    if (selectedCategory === null || newExpense.category === selectedCategory) {
      setExpenses([newExpense, ...expenses]);
      // Add to categories if new
      if (!loadedCategories.includes(newExpense.category)) {
        setLoadedCategories([...loadedCategories, newExpense.category].sort());
      }
    }
  }, [expenses, selectedCategory, loadedCategories]);

  const updateFilters = useCallback((category, newSort) => {
    setSelectedCategory(category);
    setSort(newSort);
  }, []);

  const updateDateFilter = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const calculateTotal = useCallback(() => {
    return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  }, [expenses]);

  const calculateCategoryTotals = useCallback(() => {
    const totals = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + parseFloat(exp.amount);
    });
    return totals;
  }, [expenses]);

  return {
    expenses,
    categories,
    loadedCategories,
    selectedCategory,
    selectedDate,
    sort,
    isLoading,
    error,
    addExpense,
    updateFilters,
    updateDateFilter,
    calculateTotal,
    calculateCategoryTotals,
    refetch: loadExpenses,
  };
}
