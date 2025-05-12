/**
 * Formats a price in cents/minor units to a currency string
 * @param amount The price in cents/minor units
 * @param currency The currency code (defaults to USD if not provided)
 * @returns Formatted price string with currency symbol
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
} 