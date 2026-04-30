const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Create an expense via POST /expenses
 */
export async function createExpense(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to create expense' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}

/**
 * Fetch expenses with optional filters
 */
export async function fetchExpenses(category = null, sort = 'date_desc') {
  try {
    const params = new URLSearchParams();
    if (category) {
      params.append('category', category);
    }
    if (sort) {
      params.append('sort', sort);
    }

    const query = params.toString();
    const url = `${API_BASE_URL}/expenses${query ? '?' + query : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to fetch expenses' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}

/**
 * Fetch all unique categories
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/categories`);

    if (!response.ok) {
      const error = await response.json();
      return { data: null, error: error.error || 'Failed to fetch categories' };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}
