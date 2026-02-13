// src/lib/cart/vendor-carts.svelte.ts

import { browser } from '$app/environment';
import { vendors, type Vendor } from '$lib/data/products';
import type { CartItem } from './types';
import type { WishlistItem } from '$lib/wishlist/types';

/**
 * Summary of a vendor's cart/wishlist from localStorage
 */
export interface VendorSummary {
	vendor: Vendor;
	cart: {
		items: CartItem[];
		itemCount: number;
		totalQuantity: number;
		subtotal: number;
	};
	wishlist: {
		items: WishlistItem[];
		count: number;
	};
}

/**
 * Reads all vendor carts and wishlists from localStorage.
 * This is a reactive state that updates when localStorage changes.
 *
 * Use this on pages outside vendor context (like marketplace index)
 * to show what users have saved across all vendors.
 */
export function createVendorSummaries() {
	let summaries = $state<VendorSummary[]>([]);
	let isLoaded = $state(false);

	function loadFromStorage() {
		if (!browser) return;

		const result: VendorSummary[] = [];

		for (const vendor of Object.values(vendors)) {
			// Read cart
			let cartItems: CartItem[] = [];
			try {
				const cartData = localStorage.getItem(`${vendor.id}-cart`);
				if (cartData) {
					const parsed = JSON.parse(cartData);
					cartItems = Array.isArray(parsed.items) ? parsed.items : [];
				}
			} catch {
				// Invalid data, ignore
			}

			// Read wishlist
			let wishlistItems: WishlistItem[] = [];
			try {
				const wishlistData = localStorage.getItem(`${vendor.id}-wishlist`);
				if (wishlistData) {
					wishlistItems = JSON.parse(wishlistData) || [];
				}
			} catch {
				// Invalid data, ignore
			}

			// Calculate cart totals
			const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
			const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

			result.push({
				vendor,
				cart: {
					items: cartItems,
					itemCount: cartItems.length,
					totalQuantity,
					subtotal
				},
				wishlist: {
					items: wishlistItems,
					count: wishlistItems.length
				}
			});
		}

		summaries = result;
		isLoaded = true;
	}

	// Load initially
	if (browser) {
		loadFromStorage();

		// Listen for storage changes (from other tabs or vendor pages)
		window.addEventListener('storage', loadFromStorage);
	}

	return {
		get summaries() {
			return summaries;
		},
		get isLoaded() {
			return isLoaded;
		},
		get totalCartItems() {
			return summaries.reduce((sum, s) => sum + s.cart.totalQuantity, 0);
		},
		get totalWishlistItems() {
			return summaries.reduce((sum, s) => sum + s.wishlist.count, 0);
		},
		get vendorsWithItems() {
			return summaries.filter((s) => s.cart.itemCount > 0 || s.wishlist.count > 0);
		},
		refresh: loadFromStorage
	};
}
