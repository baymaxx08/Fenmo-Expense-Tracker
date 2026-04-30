/**
 * Format currency with Indian Rupee symbol
 * @param {number | string} amount - Amount in rupees
 * @returns {string} Formatted string like "₹10,000.50"
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0.00';

  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert paise (integer) to currency (decimal string)
 * @param {number} paise - Amount in paise
 * @returns {string} Decimal string like "150.75"
 */
export function paiseToCurrency(paise) {
  return (paise / 100).toFixed(2);
}

/**
 * Convert currency string to paise (integer)
 * @param {string} currency - Decimal string like "150.75"
 * @returns {number} Amount in paise
 */
export function currencyToPaise(currency) {
  const num = parseFloat(currency);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}
