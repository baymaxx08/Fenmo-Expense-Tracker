import express from 'express';
import { createExpense, getExpenses, getCategories, currencyToPaise } from '../expenses.js';

const router = express.Router();

// Validation helper
function validateCreateExpenseBody(body) {
  const errors = [];

  if (!body.idempotency_key || typeof body.idempotency_key !== 'string') {
    errors.push('idempotency_key is required and must be a string');
  }

  if (body.amount === undefined || body.amount === null) {
    errors.push('amount is required');
  }

  const amountNum = parseFloat(body.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }

  if (!body.date || typeof body.date !== 'string') {
    errors.push('date is required and must be a valid ISO date string (YYYY-MM-DD)');
  }

  // Validate date format (YYYY-MM-DD)
  if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('date must be in YYYY-MM-DD format');
  }

  if (body.description === undefined || body.description === null) {
    errors.push('description is required');
  }

  return errors.length > 0 ? errors : null;
}

/**
 * POST /expenses
 * Create a new expense or return existing if idempotency_key matches
 */
router.post('/', (req, res) => {
  try {
    const errors = validateCreateExpenseBody(req.body);
    if (errors) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const { idempotency_key, amount, category, description, date } = req.body;

    const expense = createExpense(idempotency_key, amount, category, description, date);

    // Check if this was a new creation or retrieval (by checking created_at recency)
    // For simplicity, always return 201 for now, but the expense might be existing
    // A more precise approach would be to track if it was newly created
    res.status(201).json(expense);
  } catch (error) {
    // Handle UNIQUE constraint violation on idempotency_key
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Idempotency key conflict' });
    }
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /expenses
 * Get all expenses with optional filtering and sorting
 */
router.get('/', (req, res) => {
  try {
    const { category, sort } = req.query;

    const options = {};
    if (category) {
      options.category = category;
    }
    if (sort === 'date_asc') {
      options.sort = 'date_asc';
    } else {
      options.sort = 'date_desc';
    }

    const expenses = getExpenses(options);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /expenses/categories
 * Get all unique categories
 */
router.get('/categories', (req, res) => {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
