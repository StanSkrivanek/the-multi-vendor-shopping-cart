// src/lib/cart/cart-context.svelte.ts

import { browser } from '$app/environment';
import { getContext, hasContext, onMount, setContext } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';
import type {
	AddItemResult,
	AppliedDiscount,
	CartContext,
	CartItem,
	CartItemOptions,
	CartOptions,
	CartProduct,
	CartSummary,
	DiscountResult,
	UpdateQuantityResult
} from './types';

/**
 * Symbol key ensures no collisions with other contexts.
 */
const CART_KEY = Symbol('cart');

/**
 * Creates and provides the cart context.
 * Call this in your root layout or a dedicated CartProvider component.
 *
 * @param options - Configuration for storage, tax, and shipping
 * @returns The created CartContext
 */
export function createCartContext(options: CartOptions = {}): CartContext {
	const {
		storageKey = 'cart',
		currency = 'USD',
		taxRate = 0.08,
		freeShippingThreshold = 5000,
		shippingCost = 599,
		calculateShipping,
		couponEndpoint = '/api/coupons/validate'
	} = options;

	// ─────────────────────────────────────────────────────────────
	// State Initialization
	// ─────────────────────────────────────────────────────────────

	// Core reactive state
	let items = $state<CartItem[]>([]);
	let appliedDiscount = $state<AppliedDiscount | null>(null);
	let isLoading = $state(false);
	let isInitialized = $state(false);

	// ─────────────────────────────────────────────────────────────
	// Persistence - Load on Mount
	// ─────────────────────────────────────────────────────────────

	/**
	 * Loads cart data from localStorage.
	 * Called once on mount, handles corrupted data gracefully.
	 */
	function loadFromStorage(): void {
		if (!browser) return;

		try {
			const stored = localStorage.getItem(storageKey);
			if (!stored) {
				isInitialized = true;
				return;
			}

			const data = JSON.parse(stored);

			// Validate the stored data structure
			if (!data || !Array.isArray(data.items)) {
				isInitialized = true;
				return;
			}

			// Restore items with proper Date objects
			items = data.items.map((item: CartItem) => ({
				...item,
				addedAt: new SvelteDate(item.addedAt)
			}));

			// Restore discount if present
			if (data.discount) {
				appliedDiscount = data.discount;
			}

			isInitialized = true;
		} catch (error) {
			console.warn('Failed to load cart from storage:', error);
			isInitialized = true;
		}
	}

	// Load on mount (client-side only)
	onMount(() => {
		loadFromStorage();
	});

	// ─────────────────────────────────────────────────────────────
	// Derived Calculations
	// ─────────────────────────────────────────────────────────────

	/**
	 * Number of unique items in the cart.
	 * A cart with 2 t-shirts and 3 hats has itemCount of 2.
	 */
	const itemCount = $derived(items.length);

	/**
	 * Total units across all items.
	 * A cart with 2 t-shirts and 3 hats has totalQuantity of 5.
	 */
	const totalQuantity = $derived(items.reduce((sum, item) => sum + item.quantity, 0));

	/**
	 * Sum of price × quantity for all items, before discounts.
	 */
	const subtotal = $derived(items.reduce((sum, item) => sum + item.lineTotal, 0));

	/**
	 * Discount amount based on the applied discount code.
	 * Percentage discounts are calculated from subtotal.
	 * Fixed discounts cannot exceed subtotal.
	 */
	const discountAmount = $derived.by(() => {
		if (!appliedDiscount) return 0;

		if (appliedDiscount.type === 'fixed') {
			return Math.min(appliedDiscount.value, subtotal);
		}

		// Percentage discount
		return Math.round(subtotal * (appliedDiscount.value / 100));
	});

	/**
	 * Subtotal after discount is applied.
	 */
	const afterDiscount = $derived(Math.max(0, subtotal - discountAmount));

	/**
	 * Shipping cost calculation.
	 * Uses custom function if provided, otherwise standard logic.
	 */
	const shipping = $derived.by(() => {
		if (calculateShipping) {
			return calculateShipping(afterDiscount, itemCount);
		}
		return afterDiscount >= freeShippingThreshold ? 0 : shippingCost;
	});

	/**
	 * Tax calculated on the discounted subtotal.
	 */
	const tax = $derived(Math.round(afterDiscount * taxRate));

	/**
	 * Final total the customer pays.
	 */
	const total = $derived(afterDiscount + shipping + tax);

	/**
	 * Whether the cart has no items.
	 */
	const isEmpty = $derived(items.length === 0);

	/**
	 * Complete summary object for convenient access.
	 */
	const summary = $derived<CartSummary>({
		itemCount,
		totalQuantity,
		subtotal,
		discount: discountAmount,
		tax,
		shipping,
		total
	});

	// ─────────────────────────────────────────────────────────────
	// Persistence Effect
	// ─────────────────────────────────────────────────────────────

	/**
	 * Automatically saves cart to localStorage whenever items or discount change.
	 * Only runs after initial load to avoid overwriting stored data.
	 */
	$effect(() => {
		if (!browser || !isInitialized) return;

		const data = {
			items,
			discount: appliedDiscount,
			updatedAt: Date.now()
		};

		try {
			localStorage.setItem(storageKey, JSON.stringify(data));
		} catch (error) {
			console.warn('Failed to save cart to storage:', error);
		}
	});

	// ─────────────────────────────────────────────────────────────
	// Helper Functions
	// ─────────────────────────────────────────────────────────────

	/**
	 * Generates a unique ID for a cart item based on product and options.
	 * Same product with different options = different cart lines.
	 */
	function generateItemId(productId: string, options: CartItemOptions): string {
		const optionsKey = Object.entries(options)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, v]) => v !== undefined)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([k, v]) => `${k}:${v}`)
			.join('|');

		return optionsKey ? `${productId}__${optionsKey}` : productId;
	}

	/**
	 * Finds an item by its cart ID.
	 */
	function findItemById(id: string): CartItem | undefined {
		return items.find((item) => item.id === id);
	}

	/**
	 * Finds an item by product ID and optional variant options.
	 */
	function findItemByProduct(
		productId: string,
		options: CartItemOptions = {}
	): CartItem | undefined {
		const targetId = generateItemId(productId, options);
		return items.find((item) => item.id === targetId);
	}

	/**
	 * Finds the index of an item by its cart ID.
	 */
	function findItemIndex(id: string): number {
		return items.findIndex((item) => item.id === id);
	}

	// ─────────────────────────────────────────────────────────────
	// Context Object
	// ─────────────────────────────────────────────────────────────

	const context: CartContext = {
		// Reactive getters
		get items() {
			return items;
		},
		get summary() {
			return summary;
		},
		get isEmpty() {
			return isEmpty;
		},
		get isLoading() {
			return isLoading;
		},
		get appliedDiscount() {
			return appliedDiscount;
		},
		get currency() {
			return currency;
		},
		get itemCount() {
			return itemCount;
		},
		get totalQuantity() {
			return totalQuantity;
		},

		/**
		 * Adds an item to the cart or increases quantity if already present.
		 * Validates quantity and respects stock limits.
		 */
		addItem(product: CartProduct, quantity = 1, options: CartItemOptions = {}): AddItemResult {
			// Validate product
			if (!product?.id || !product?.name || typeof product.price !== 'number') {
				return {
					success: false,
					error: 'INVALID_PRODUCT',
					message: 'Product must have id, name, and price'
				};
			}

			// Validate quantity
			if (quantity < 1 || !Number.isInteger(quantity)) {
				return {
					success: false,
					error: 'INVALID_QUANTITY',
					message: 'Quantity must be a positive integer'
				};
			}

			const itemId = generateItemId(product.id, options);
			const existing = findItemById(itemId);

			if (existing) {
				// Update quantity of existing item
				const newQuantity = existing.quantity + quantity;
				const maxQty = product.maxQuantity ?? Infinity;

				if (newQuantity > maxQty) {
					return {
						success: false,
						error: 'MAX_QUANTITY_EXCEEDED',
						message: `Maximum ${maxQty} allowed`
					};
				}

				existing.quantity = newQuantity;
				existing.lineTotal = newQuantity * existing.product.price;
				return { success: true, item: existing };
			}

			// Add new item
			const effectiveQty = product.maxQuantity ? Math.min(quantity, product.maxQuantity) : quantity;

			if (product.maxQuantity && quantity > product.maxQuantity) {
				return {
					success: false,
					error: 'MAX_QUANTITY_EXCEEDED',
					message: `Maximum ${product.maxQuantity} allowed`
				};
			}

			const newItem: CartItem = {
				id: itemId,
				product,
				quantity: effectiveQty,
				options,
				addedAt: new SvelteDate(),
				lineTotal: effectiveQty * product.price
			};

			items.push(newItem);
			return { success: true, item: newItem };
		},

		/**
		 * Updates the quantity of a specific cart item.
		 * Setting quantity to 0 or less removes the item.
		 */
		updateQuantity(id: string, quantity: number): UpdateQuantityResult {
			// Validate quantity
			if (!Number.isInteger(quantity)) {
				return {
					success: false,
					error: 'INVALID_QUANTITY',
					message: 'Quantity must be an integer'
				};
			}

			const item = findItemById(id);

			if (!item) {
				return {
					success: false,
					error: 'ITEM_NOT_FOUND',
					message: 'Item not found in cart'
				};
			}

			// Quantity 0 or less means remove
			if (quantity <= 0) {
				this.removeItem(id);
				return { success: true };
			}

			// Check stock limit
			const maxQty = item.product.maxQuantity ?? Infinity;
			if (quantity > maxQty) {
				return {
					success: false,
					error: 'MAX_QUANTITY_EXCEEDED',
					message: `Maximum ${maxQty} allowed`
				};
			}

			item.quantity = quantity;
			item.lineTotal = quantity * item.product.price;
			return { success: true };
		},

		/**
		 * Removes an item from the cart entirely.
		 */
		removeItem(id: string): void {
			const index = findItemIndex(id);
			if (index !== -1) {
				items.splice(index, 1);
			}
		},

		/**
		 * Empties the cart and removes any applied discount.
		 */
		clearCart(): void {
			items.length = 0;
			appliedDiscount = null;
		},

		/**
		 * Gets a cart item by product ID and options.
		 */
		getItem(productId: string, options: CartItemOptions = {}): CartItem | undefined {
			return findItemByProduct(productId, options);
		},

		/**
		 * Checks if a product is in the cart.
		 */
		hasItem(productId: string, options: CartItemOptions = {}): boolean {
			return findItemByProduct(productId, options) !== undefined;
		},

		/**
		 * Gets the quantity of a product in the cart.
		 * Returns 0 if the product is not in the cart.
		 */
		getQuantity(productId: string, options: CartItemOptions = {}): number {
			const item = findItemByProduct(productId, options);
			return item?.quantity ?? 0;
		},

		/**
		 * Applies a discount code to the cart.
		 * Validates the code with your backend API.
		 */
		async applyDiscount(code: string): Promise<DiscountResult> {
			if (!code.trim()) {
				return {
					success: false,
					error: 'Please enter a discount code'
				};
			}

			isLoading = true;

			try {
				const response = await fetch(couponEndpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						code: code.trim().toUpperCase(),
						subtotal
					})
				});

				const data = await response.json();

				if (!response.ok) {
					return {
						success: false,
						error: data.message ?? 'Invalid discount code'
					};
				}

				// Apply the validated discount
				appliedDiscount = {
					code: data.code,
					value: data.value,
					type: data.type,
					appliedAmount: data.appliedAmount
				};

				return { success: true, discount: appliedDiscount };
			} catch (error) {
				console.error('Discount validation error:', error);
				return {
					success: false,
					error: 'Unable to validate discount code. Please try again.'
				};
			} finally {
				isLoading = false;
			}
		},

		/**
		 * Removes the currently applied discount.
		 */
		removeDiscount(): void {
			appliedDiscount = null;
		}
	};

	return setContext(CART_KEY, context);
}

/**
 * Retrieves the cart context.
 * Must be called from a component inside a CartProvider.
 */
export function getCartContext(): CartContext {
	if (!hasContext(CART_KEY)) {
		throw new Error(
			'Cart context not found. ' +
				'Ensure your component is inside a CartProvider or the root layout.'
		);
	}
	return getContext(CART_KEY);
}

/**
 * Checks if cart context is available.
 * Useful for components that may render outside the cart context.
 */
export function hasCartContext(): boolean {
	return hasContext(CART_KEY);
}
