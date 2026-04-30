import { v4 as uuidv4 } from 'uuid';

const IDEMPOTENCY_KEY_PREFIX = 'expense_form_';

/**
 * Generate a hash of the form content for deduplication
 */
function hashFormContent(amount, category, description, date) {
  return `${amount}|${category}|${description}|${date}`;
}

/**
 * Generate or retrieve an idempotency key for the expense form
 * Stores the key in sessionStorage keyed to form content hash
 * @returns {string} UUID v4
 */
export function getOrCreateIdempotencyKey(amount, category, description, date) {
  const contentHash = hashFormContent(amount, category, description, date);
  const storageKey = IDEMPOTENCY_KEY_PREFIX + contentHash;

  let key = sessionStorage.getItem(storageKey);
  if (!key) {
    key = uuidv4();
    sessionStorage.setItem(storageKey, key);
  }

  return key;
}

/**
 * Clear the idempotency key for the given form content
 */
export function clearIdempotencyKey(amount, category, description, date) {
  const contentHash = hashFormContent(amount, category, description, date);
  const storageKey = IDEMPOTENCY_KEY_PREFIX + contentHash;
  sessionStorage.removeItem(storageKey);
}

/**
 * Generate a new UUID v4
 */
export function generateKey() {
  return uuidv4();
}
