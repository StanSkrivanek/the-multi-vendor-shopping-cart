/**
 * Type-safe route constants for the demo.
 * Provides centralized route definitions for easy refactoring.
 */
export const ROUTES = {
	HOME: '/',
	PRODUCTS: '/demo/products',
	MARKETPLACE: '/demo/marketplace',
	CART: '/demo/cart',
	WISHLIST: '/demo/wishlist',

	// Vendor routes (require slug parameter)
	vendor: (slug: string) => `/demo/marketplace/${slug}`,
	vendorCart: (slug: string) => `/demo/marketplace/${slug}/cart`,
	vendorWishlist: (slug: string) => `/demo/marketplace/${slug}/wishlist`,

	// API routes
	apiValidateCoupon: '/api/coupons/validate'
} as const;
