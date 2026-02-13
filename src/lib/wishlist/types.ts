// src/lib/wishlist/types.ts

import type { CartProduct } from '$lib/cart/types';

/**
 * Wishlist is simpler than cart - just tracks products without quantities.
 */
export interface WishlistItem {
	/** The product in the wishlist */
	product: CartProduct;

	/** When this product was added to the wishlist */
	addedAt: Date;
}

/**
 * The public API of the wishlist context.
 */
export interface WishlistContext {
	// Reactive state (readonly to consumers)
	readonly items: WishlistItem[];
	readonly count: number;
	readonly isEmpty: boolean;

	// Operations
	add(product: CartProduct): void;
	remove(productId: string): void;
	has(productId: string): boolean;
	clear(): void;
	toggle(product: CartProduct): void;
}
