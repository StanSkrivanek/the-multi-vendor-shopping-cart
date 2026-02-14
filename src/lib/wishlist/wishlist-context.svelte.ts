// src/lib/wishlist/wishlist-context.svelte.ts

import { browser } from '$app/environment';
import type { CartProduct } from '$lib/cart/types';
import { getContext, hasContext, onMount, setContext } from 'svelte';
import type { WishlistContext, WishlistItem } from './types';
import { SvelteDate } from 'svelte/reactivity';

/**
 * Symbol key ensures no collisions with cart context.
 */
const WISHLIST_KEY = Symbol('wishlist');

export function createWishlistContext(storageKey = 'wishlist'): WishlistContext {
	// State Initialization
	let items = $state<WishlistItem[]>([]);
	let isInitialized = $state(false);

	// Persistence - Load on Mount
	function loadFromStorage(): void {
		if (!browser) return;

		try {
			const stored = localStorage.getItem(storageKey);
			if (stored) {
				const data = JSON.parse(stored);
				items = data.map((item: WishlistItem) => ({
					...item,
					addedAt: new SvelteDate(item.addedAt)
				}));
			}
			isInitialized = true;
		} catch (error) {
			console.warn('Failed to load wishlist:', error);
			isInitialized = true;
		}
	}

	onMount(() => {
		loadFromStorage();
	});

	// Derived Values
	const count = $derived(items.length);
	const isEmpty = $derived(items.length === 0);

	// Persistence Effect
	$effect(() => {
		if (!browser || !isInitialized) return;
		localStorage.setItem(storageKey, JSON.stringify(items));
	});

	// Context Object
	const context: WishlistContext = {
		get items() {
			return items;
		},
		get count() {
			return count;
		},
		get isEmpty() {
			return isEmpty;
		},

		add(product: CartProduct): void {
			if (!items.some((i) => i.product.id === product.id)) {
				items.push({ product, addedAt: new SvelteDate() });
			}
		},

		remove(productId: string): void {
			const index = items.findIndex((i) => i.product.id === productId);
			if (index !== -1) {
				items.splice(index, 1);
			}
		},

		has(productId: string): boolean {
			return items.some((i) => i.product.id === productId);
		},

		toggle(product: CartProduct): void {
			if (this.has(product.id)) {
				this.remove(product.id);
			} else {
				this.add(product);
			}
		},

		clear(): void {
			items.length = 0;
		}
	};

	return setContext(WISHLIST_KEY, context);
}

export function getWishlistContext(): WishlistContext {
	if (!hasContext(WISHLIST_KEY)) {
		throw new Error('Wishlist context not found.');
	}
	return getContext(WISHLIST_KEY);
}
