/**
 * Formats cents as a localized currency string.
 *
 * @param cents - Price in cents (e.g., 1999 = $19.99)
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @returns Formatted currency string (e.g., "$19.99")
 */
export function formatPrice(cents: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(cents / 100);
}
