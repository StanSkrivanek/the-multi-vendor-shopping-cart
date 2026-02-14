---
title: 'Shopping Cart with Context (Rebuilt)'
description: 'Rebuild a production-grade cart with Svelte 5 context using the current project code and learn the why behind each decision.'
date: 2026-02-14
lastUpdated: 2026-02-14

track:
  id: svelte-reference
  title: Svelte 5 Reference
  slug: svelte-reference
  order: 2

topic:
  id: context_api
  title: Context API
  slug: context_api
  order: 5

module:
  id: context-shopping-cart-rebuilt
  title: Shopping Cart with Context (Rebuilt)
  slug: context-shopping-cart-rebuilt
  order: 20
  description: 'Rebuild a production-grade shopping cart using Svelte 5 context, reactive calculations, persistence timing, and scoped isolation.'

tags:
  - svelte
  - context
  - e-commerce
  - shopping-cart
  - runes
  - state-management

difficulty: expert
readingTime: 60

seo:
  title: 'Shopping Cart with Context (Rebuilt) | Context API | Svelte Reference'
  description: 'Rebuild a production-grade cart with Svelte 5 context and learn why each architectural decision matters.'
  keywords:
    - svelte shopping cart
    - svelte context
    - svelte 5 runes
    - shopping cart persistence
    - scoped context

status: published
featured: false
published: true
---

## Introduction

This is a rebuilt, step-by-step article that uses the current project implementation as the single source of truth. By the end, you will be able to recreate the cart system and understand the tradeoffs behind each choice.

Everything in this guide is drawn from real files in this project:

- Core cart context: [src/lib/cart/cart-context.svelte.ts](src/lib/cart/cart-context.svelte.ts)
- Cart provider: [src/lib/cart/CartProvider.svelte](src/lib/cart/CartProvider.svelte)
- Cart UI components: [src/lib/cart](src/lib/cart)
- Wishlist context: [src/lib/wishlist/wishlist-context.svelte.ts](src/lib/wishlist/wishlist-context.svelte.ts)
- Vendor rollups: [src/lib/cart/vendor-carts.svelte.ts](src/lib/cart/vendor-carts.svelte.ts)
- Discount API: [src/routes/api/coupons/validate/+server.ts](src/routes/api/coupons/validate/+server.ts)
- Currency formatter: [src/lib/utils/formatting.ts](src/lib/utils/formatting.ts)

If you are new to Svelte context, focus on the flow: define types, create context, provide context, build UI, then add extras like discounts and vendor rollups.

---

## What You Will Build

- A cart context with `$state`, `$derived`, and `$effect`.
- Safe persistence that loads before saving.
- A provider that scopes cart instances by tree position.
- UI components with bindable inputs and clear feedback.
- A discount validation endpoint.
- Multi-vendor rollups that keep isolation but show global totals.

---

## Step 1: Define the Cart Contract

The cart relies on explicit TypeScript types so every component sees the same contract. This keeps errors local and makes the API discoverable.

```ts
export interface CartProduct {
	id: string;
	name: string;
	price: number;
	image?: string;
	sku?: string;
	maxQuantity?: number;
}

export interface CartItemOptions {
	size?: string;
	color?: string;
	[key: string]: string | undefined;
}

export interface CartItem {
	id: string;
	product: CartProduct;
	quantity: number;
	options: CartItemOptions;
	addedAt: Date;
	lineTotal: number;
}

export interface CartSummary {
	itemCount: number;
	totalQuantity: number;
	subtotal: number;
	discount: number;
	tax: number;
	shipping: number;
	total: number;
}
```

Why this matters:

- `CartItemOptions` makes variants first-class, so a small blue and a large blue become distinct cart lines.
- Monetary values are stored as cents to avoid floating-point drift.
- Result objects (not shown above) communicate errors without throwing.

---

## Step 2: Build the Cart Context

The context is the heart of the system. It owns state, computes totals, and handles persistence.

### State and Persistence Timing

The implementation loads once, then saves after initialization. This prevents a blank cart from overwriting stored data.

```ts
let items = $state<CartItem[]>([]);
let appliedDiscount = $state<AppliedDiscount | null>(null);
let isLoading = $state(false);
let isInitialized = $state(false);

$effect.pre(() => {
	if (!browser || isInitialized) return;
	loadFromStorage();
});
```

### Reactive Dates with `SvelteDate`

When rehydrating from localStorage, `Date` values arrive as strings. `SvelteDate` restores them as reactive dates.

```ts
items = data.items.map((item: CartItem) => ({
	...item,
	addedAt: new SvelteDate(item.addedAt)
}));
```

### Derived Totals

All totals are computed with `$derived`. This makes every view consistent and avoids manual recalculation in UI code.

```ts
const subtotal = $derived(items.reduce((sum, item) => sum + item.lineTotal, 0));

const discountAmount = $derived.by(() => {
	if (!appliedDiscount) return 0;
	if (appliedDiscount.type === 'fixed') {
		return Math.min(appliedDiscount.value, subtotal);
	}
	return Math.round(subtotal * (appliedDiscount.value / 100));
});

const afterDiscount = $derived(Math.max(0, subtotal - discountAmount));
const tax = $derived(Math.round(afterDiscount * taxRate));
const total = $derived(afterDiscount + shipping + tax);
```

### Persist on Change

Once initialized, save on any update to items or discounts.

```ts
$effect(() => {
	if (!browser || !isInitialized) return;

	const data = {
		items,
		discount: appliedDiscount,
		updatedAt: Date.now()
	};

	localStorage.setItem(storageKey, JSON.stringify(data));
});
```

Why this matters:

- `$effect.pre` prevents clobbering saved carts.
- `$derived` enforces a single source of truth.
- You never calculate totals in a component by hand.

---

## Step 3: Provide the Context Once

The provider creates the context once and makes it available to descendants. `untrack` locks the initial options so a parent re-render does not reinitialize state.

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createCartContext } from './cart-context.svelte';
	import type { CartOptions } from './types';

	interface Props extends CartOptions {
		children: Snippet;
	}

	let {
		storageKey,
		currency,
		taxRate,
		freeShippingThreshold,
		shippingCost,
		calculateShipping,
		couponEndpoint,
		children
	}: Props = $props();

	untrack(() => {
		createCartContext({
			storageKey,
			currency,
			taxRate,
			freeShippingThreshold,
			shippingCost,
			calculateShipping,
			couponEndpoint
		});
	});
</script>

{@render children()}
```

Why this matters:

- A provider is the boundary for context scope and SSR isolation.
- `untrack` prevents accidental re-creation of the cart on prop changes.

---

## Step 4: Wire the Provider in the Root Layout

Wrap the app once at the top level so every page can read the cart. The root layout in this project also nests the wishlist provider.

```svelte
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte';
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<CartProvider taxRate={0.08} freeShippingThreshold={7500} currency="USD">
	<WishlistProvider>
		<main>
			{@render children()}
		</main>
	</WishlistProvider>
</CartProvider>
```

Why this matters:

- Each request gets its own context instance, avoiding SSR state bleed.
- Scoped providers make it easy to override cart behavior in nested routes.

---

## Step 5: Build the UI Components

### Bindable Quantity Input

The quantity selector uses `$bindable` so parents can use `bind:value` while the component still validates input.

```svelte
<script lang="ts">
	interface Props {
		value?: number;
		min?: number;
		max?: number;
		onchange?: (quantity: number) => void;
		disabled?: boolean;
		compact?: boolean;
	}

	let {
		value = $bindable(1),
		min = 1,
		max,
		onchange,
		disabled = false,
		compact = false
	}: Props = $props();

	let canDecrement = $derived(value > min && !disabled);
	let canIncrement = $derived((!max || value < max) && !disabled);

	function decrement() {
		if (canDecrement) {
			value -= 1;
			onchange?.(value);
		}
	}

	function increment() {
		if (canIncrement) {
			value += 1;
			onchange?.(value);
		}
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		let newValue = parseInt(input.value, 10);

		if (isNaN(newValue) || newValue < min) {
			newValue = min;
		} else if (max && newValue > max) {
			newValue = max;
		}

		value = newValue;
		onchange?.(value);
	}
</script>

<div class="quantity-selector" class:disabled class:compact>
	<button
		type="button"
		class="qty-btn"
		onclick={decrement}
		disabled={!canDecrement}
		aria-label="Decrease quantity"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	</button>

	<input
		type="number"
		class="qty-input"
		bind:value
		{min}
		{max}
		{disabled}
		oninput={handleInput}
		aria-label="Quantity"
	/>

	<button
		type="button"
		class="qty-btn"
		onclick={increment}
		disabled={!canIncrement}
		aria-label="Increase quantity"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	</button>
</div>
```

### Add-to-Cart Button as a State Machine

The add button communicates loading, success, and error states while calling the cart API.

```svelte
<script lang="ts">
	import { getCartContext } from './cart-context.svelte';
	import type { CartProduct, CartItemOptions } from './types';

	interface Props {
		product: CartProduct;
		quantity?: number;
		options?: CartItemOptions;
		class?: string;
	}

	let { product, quantity = 1, options = {}, class: className = '' }: Props = $props();

	const cart = getCartContext();

	type ButtonState = 'idle' | 'adding' | 'added' | 'error';
	let buttonState = $state<ButtonState>('idle');
	let errorMessage = $state('');

	let isInCart = $derived(cart.hasItem(product.id, options));
	let cartQuantity = $derived(cart.getQuantity(product.id, options));

	async function handleAdd() {
		buttonState = 'adding';
		await new Promise((resolve) => setTimeout(resolve, 200));

		const result = cart.addItem(product, quantity, options);

		if (result.success) {
			buttonState = 'added';
			setTimeout(() => {
				buttonState = 'idle';
			}, 2000);
		} else {
			buttonState = 'error';
			errorMessage = result.message ?? 'Could not add to cart';
			setTimeout(() => {
				buttonState = 'idle';
				errorMessage = '';
			}, 3000);
		}
	}
</script>

<button
	type="button"
	class="add-to-cart {className}"
	class:adding={buttonState === 'adding'}
	class:added={buttonState === 'added'}
	class:error={buttonState === 'error'}
	class:in-cart={isInCart && buttonState === 'idle'}
	onclick={handleAdd}
	disabled={buttonState === 'adding'}
>
	{#if buttonState === 'adding'}
		<span class="spinner" aria-hidden="true"></span>
		<span>Adding...</span>
	{:else if buttonState === 'added'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<polyline points="20 6 9 17 4 12" />
		</svg>
		<span>Added!</span>
	{:else if buttonState === 'error'}
		<span>{errorMessage}</span>
	{:else if isInCart}
		<span>In Cart ({cartQuantity})</span>
	{:else}
		<span>Add to Cart</span>
	{/if}
</button>
```

Other UI pieces live in [src/lib/cart](src/lib/cart):

- The cart summary uses `formatPrice` from [src/lib/utils/formatting.ts](src/lib/utils/formatting.ts).
- The cart icon displays a badge using `cart.totalQuantity`.

---

## Step 6: Validate Discounts on the Server

Discount codes are validated by a server endpoint. The cart calls this endpoint via `couponEndpoint` in its options.

```ts
const DISCOUNT_CODES: Record<
	string,
	{
		type: 'percentage' | 'fixed';
		value: number;
		minOrder?: number;
		description: string;
	}
> = {
	SAVE10: {
		type: 'percentage',
		value: 10,
		description: '10% off your order'
	},
	SAVE20: {
		type: 'percentage',
		value: 20,
		minOrder: 5000,
		description: '20% off orders over $50'
	},
	FLAT5: {
		type: 'fixed',
		value: 500,
		description: '$5 off your order'
	},
	WELCOME: {
		type: 'percentage',
		value: 15,
		description: '15% off for new customers'
	},
	FREESHIP: {
		type: 'fixed',
		value: 599,
		description: 'Free shipping ($5.99 value)'
	}
};
```

Why this matters:

- The server validates business rules and minimum order thresholds.
- The cart stays thin and trustless: it only applies validated results.

---

## Step 7: Vendor Isolation and Global Rollups

Vendor routes can override the cart provider with different storage keys, currencies, and shipping rules. To show a global summary, the app reads all vendor carts from localStorage and aggregates them.

```ts
export function createVendorSummaries() {
	let summaries = $state<VendorSummary[]>([]);
	let isLoaded = $state(false);

	function loadFromStorage() {
		if (!browser) return;

		const result: VendorSummary[] = [];

		for (const vendor of Object.values(vendors)) {
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

			let wishlistItems: WishlistItem[] = [];
			try {
				const wishlistData = localStorage.getItem(`${vendor.id}-wishlist`);
				if (wishlistData) {
					wishlistItems = JSON.parse(wishlistData) || [];
				}
			} catch {
				// Invalid data, ignore
			}

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

	if (browser) {
		loadFromStorage();
		window.addEventListener('storage', loadFromStorage);
	}

	return {
		get summaries() {
			return summaries;
		},
		get totalCartItems() {
			return summaries.reduce((sum, s) => sum + s.cart.totalQuantity, 0);
		},
		get totalWishlistItems() {
			return summaries.reduce((sum, s) => sum + s.wishlist.count, 0);
		},
		refresh: loadFromStorage
	};
}
```

Why this matters:

- Isolation keeps vendor carts separate and safe.
- Rollups give the user a global view without merging carts.

---

## Step 8: Add a Wishlist Context

Wishlist is its own context with simpler rules. The pattern is the same, but the API is smaller.

```ts
export function createWishlistContext(storageKey = 'wishlist'): WishlistContext {
	let items = $state<WishlistItem[]>([]);
	let isInitialized = $state(false);

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

	$effect.pre(() => {
		if (!browser || isInitialized) return;
		loadFromStorage();
	});

	const count = $derived(items.length);
	const isEmpty = $derived(items.length === 0);

	$effect(() => {
		if (!browser || !isInitialized) return;
		localStorage.setItem(storageKey, JSON.stringify(items));
	});

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
```

Why this matters:

- Multiple contexts can coexist without coupling.
- Shared patterns make the codebase easier to extend.

---

## Common Pitfalls and Why This Design Avoids Them

- **Global state in modules** risks SSR state bleed. Context keeps state per request tree.
- **Reassigning `$state` objects** breaks reactivity; mutate properties instead.
- **Manual totals** drift out of sync. `$derived` removes this risk.
- **Immediate persistence** overwrites saved carts. `$effect.pre` fixes the timing.

---

## Recap

You now have a cart system you can rebuild from scratch:

- A typed cart contract with explicit result objects.
- A context that owns state, derivations, and persistence.
- Providers that scope data safely in SSR and nested routes.
- UI pieces that are bindable, responsive, and error-aware.
- Vendor rollups and a wishlist context that follow the same pattern.

If you want a guided walkthrough of specific pages, open the demo routes and trace how each page consumes `getCartContext()` and `getWishlistContext()`.
