// src/lib/cart/types.ts

/**
 * Product information required for cart operations.
 * This is the minimum data needed to add an item.
 */
export interface CartProduct {
	/** Unique product identifier from your catalog */
	id: string;

	/** Display name for the product */
	name: string;

	/** Price per unit in cents (e.g., 1999 = $19.99) */
	price: number;

	/** URL to product image for display in cart */
	image?: string;

	/** SKU for inventory tracking */
	sku?: string;

	/** Maximum allowed quantity (stock limit) */
	maxQuantity?: number;
}

/**
 * Options/variants for a cart item.
 * Supports arbitrary key-value pairs for flexibility.
 */
export interface CartItemOptions {
	size?: string;
	color?: string;
	[key: string]: string | undefined;
}

/**
 * A single item in the shopping cart.
 * Each item tracks a specific product variant and quantity.
 */
export interface CartItem {
	/** Unique identifier for this cart entry (product + options) */
	id: string;

	/** Reference to the original product data */
	product: CartProduct;

	/** How many of this item the user wants */
	quantity: number;

	/** Selected options/variants for this item */
	options: CartItemOptions;

	/** When this item was added to the cart */
	addedAt: Date;

	/** Computed: price × quantity for this line */
	lineTotal: number;
}

/**
 * Applied discount/coupon information.
 */
export interface AppliedDiscount {
	/** The discount code used */
	code: string;

	/** Type of discount calculation */
	type: 'percentage' | 'fixed';

	/** The discount value (percentage or cents) */
	value: number;

	/** The actual amount discounted in cents */
	appliedAmount: number;
}

/**
 * Calculated summary of the cart's current state.
 * All monetary values are in cents.
 */
export interface CartSummary {
	/** Number of unique items (different products/variants) */
	itemCount: number;

	/** Total number of units across all items */
	totalQuantity: number;

	/** Sum of (price × quantity) for all items */
	subtotal: number;

	/** Discount amount if a code is applied */
	discount: number;

	/** Calculated tax amount */
	tax: number;

	/** Shipping cost (may be zero for free shipping) */
	shipping: number;

	/** Final total: subtotal - discount + tax + shipping */
	total: number;
}

/**
 * Result of attempting to add an item to the cart.
 * Operations return result objects rather than throwing errors.
 */
export interface AddItemResult {
	success: boolean;
	error?: 'MAX_QUANTITY_EXCEEDED' | 'INVALID_QUANTITY' | 'INVALID_PRODUCT';
	item?: CartItem;
	message?: string;
}

/**
 * Result of attempting to update an item's quantity.
 */
export interface UpdateQuantityResult {
	success: boolean;
	error?: 'ITEM_NOT_FOUND' | 'MAX_QUANTITY_EXCEEDED' | 'INVALID_QUANTITY';
	message?: string;
}

/**
 * Result of attempting to apply a discount code.
 */
export interface DiscountResult {
	success: boolean;
	discount?: AppliedDiscount;
	error?: string;
}

/**
 * Configuration options for the cart provider.
 */
export interface CartOptions {
	/** Storage key for persistence (default: 'cart') */
	storageKey?: string;

	/** Currency code (default: 'USD') */
	currency?: string;

	/** Tax rate as a decimal (default: 0.08 for 8%) */
	taxRate?: number;

	/** Subtotal threshold for free shipping in cents (default: 5000) */
	freeShippingThreshold?: number;

	/** Standard shipping cost in cents (default: 599) */
	shippingCost?: number;

	/** Custom shipping calculation function */
	calculateShipping?: (subtotal: number, itemCount: number) => number;

	/** API endpoint for coupon validation */
	couponEndpoint?: string;
}

/**
 * The public API of the cart context.
 * This interface documents everything components can do with the cart.
 */
export interface CartContext {
	// Reactive state (readonly to consumers)
	readonly items: CartItem[];
	readonly summary: CartSummary;
	readonly isEmpty: boolean;
	readonly isLoading: boolean;
	readonly appliedDiscount: AppliedDiscount | null;
	readonly currency: string;

	// Convenience accessors
	readonly itemCount: number;
	readonly totalQuantity: number;

	// Item operations
	addItem(product: CartProduct, quantity?: number, options?: CartItemOptions): AddItemResult;

	updateQuantity(id: string, quantity: number): UpdateQuantityResult;
	removeItem(id: string): void;
	clearCart(): void;

	// Queries
	getItem(productId: string, options?: CartItemOptions): CartItem | undefined;
	hasItem(productId: string, options?: CartItemOptions): boolean;
	getQuantity(productId: string, options?: CartItemOptions): number;

	// Discounts
	applyDiscount(code: string): Promise<DiscountResult>;
	removeDiscount(): void;
}
