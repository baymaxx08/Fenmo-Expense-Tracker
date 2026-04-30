import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

/**
 * Convert decimal string (e.g., "150.75") to paise (integer)
 */
export function currencyToPaise(currencyStr) {
  const num = parseFloat(currencyStr);
  if (isNaN(num)) return null;
  return Math.round(num * 100);
}

/**
 * Convert paise (integer) to decimal string (e.g., 1050 -> "10.50")
 */
export function paiseToCurrency(paise) {
  return (paise / 100).toFixed(2);
}

/**
 * Normalize expense record: convert paise to decimal string for API responses
 */
export function normalizeExpense(row) {
  return {
    id: row.id,
    idempotency_key: row.idempotency_key,
    amount: paiseToCurrency(row.amount_paise),
    category: row.category,
    description: row.description,
    date: row.date,
    created_at: row.created_at,
  };
}

/**
 * Create or retrieve an expense by idempotency key
 * Returns the expense if it already exists, or creates a new one
 */
export function createExpense(idempotencyKey, amount, category, description, date) {
  // Check if expense already exists with this idempotency key
  const existing = db
    .prepare('SELECT * FROM expenses WHERE idempotency_key = ?')
    .get(idempotencyKey);

  if (existing) {
    return normalizeExpense(existing);
  }

  // Create new expense
  const id = uuidv4();
  const amountPaise = currencyToPaise(amount);
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO expenses (id, idempotency_key, amount_paise, category, description, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, idempotencyKey, amountPaise, category, description, date, createdAt);

  const row = db
    .prepare('SELECT * FROM expenses WHERE id = ?')
    .get(id);

  return normalizeExpense(row);
}

/**
 * Get all expenses with optional filtering and sorting
 */
export function getExpenses(options = {}) {
  const { category = null, sort = 'date_desc' } = options;

  let query = 'SELECT * FROM expenses';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  if (sort === 'date_asc') {
    query += ' ORDER BY date ASC, created_at ASC';
  } else {
    query += ' ORDER BY date DESC, created_at DESC';
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);

  return rows.map(normalizeExpense);
}

/**
 * Get all unique categories
 */
export function getCategories() {
  const stmt = db.prepare('SELECT DISTINCT category FROM expenses ORDER BY category ASC');
  const rows = stmt.all();
  return rows.map(row => row.category);
}
