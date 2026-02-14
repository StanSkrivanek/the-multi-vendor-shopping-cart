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
readingTime: 70

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

A shopping cart stresses state management: many pages read and write it, totals must stay reactive, and persistence must be reliable. Context gives you a clean, scalable model, but only if you avoid the naive global-store trap that breaks SSR isolation, multi-tenant scoping, and test reliability.

In this article, you will build a production-ready cart with variants, reactive totals, persistence, discount validation, and scoped isolation, then extend it with server sync and performance patterns using `$state`, `$derived`, and `$effect`.

Everything in this guide is drawn from real files in this project:

- Core cart context: [src/lib/cart/cart-context.svelte.ts](src/lib/cart/cart-context.svelte.ts)
- Cart provider: [src/lib/cart/CartProvider.svelte](src/lib/cart/CartProvider.svelte)
- Cart UI components: [src/lib/cart](src/lib/cart)
- Wishlist context: [src/lib/wishlist/wishlist-context.svelte.ts](src/lib/wishlist/wishlist-context.svelte.ts)
- Vendor rollups: [src/lib/cart/vendor-carts.svelte.ts](src/lib/cart/vendor-carts.svelte.ts)
- Discount API: [src/routes/api/coupons/validate/+server.ts](src/routes/api/coupons/validate/+server.ts)
- Currency formatter: [src/lib/utils/formatting.ts](src/lib/utils/formatting.ts)

---

## Why Context for Carts?

Shopping carts seem like a perfect case for global state. Every page needs access, right? But global cart state creates more problems than it solves.

Consider these real scenarios:

- Marketplace platforms: multiple vendors, each with their own checkout flow.
- Multi-site e-commerce: one app serves several storefronts.
- B2B portals: different departments with separate budgets.
- Wishlist vs cart: different "bags" with similar behavior.
- Server rendering: request isolation is mandatory.

Context gives you scoped, isolated cart state that scales to these complexities. Let us build it properly.

---

## The Problem with Global Stores

Before diving into context, it helps to see why global state creates problems in production apps.

```
Global Store Problems:
======================

+--------------------------------------------------------------+
|                      Global Cart Store                       |
|                                                              |
|  Problem 1: SSR State Bleed                                  |
|  +--------------------------------------------------------+  |
|  |  Request A: User adds Widget to cart                   |  |
|  |  Request B: Different user sees Widget in their cart    |  |
|  |                                                        |  |
|  |  On the server, module-level state persists across      |  |
|  |  requests. Without request isolation, users see each    |  |
|  |  other's data.                                          |  |
|  +--------------------------------------------------------+  |
|                                                              |
|  Problem 2: No Isolation                                     |
|  +--------------------------------------------------------+  |
|  |  Marketplace with multiple vendors:                    |  |
|  |  - Storefront A: Electronics                           |  |
|  |  - Storefront B: Groceries                             |  |
|  |  Same cart? Different carts? Global stores cannot scope |  |
|  +--------------------------------------------------------+  |
|                                                              |
|  Problem 3: Testing Nightmares                               |
|  +--------------------------------------------------------+  |
|  |  Test 1: Adds item, expects count = 1                   |  |
|  |  Test 2: Runs next, cart already has item from Test 1    |  |
|  |                                                        |  |
|  |  Tests must manually reset state, creating fragile      |  |
|  |  test suites that break in unexpected ways.             |  |
|  +--------------------------------------------------------+  |
|                                                              |
+--------------------------------------------------------------+
```

Context solves all three problems through its fundamental design:

- SSR safety: each request creates a fresh component tree with its own context instances.
- Scoped isolation: nested providers let different parts of the app use different carts.
- Test independence: each test renders its own context without shared state.

---

## Cart Patterns in the Wild

The most common cart pattern in marketplaces is a unified cart. It is a simpler mental model that consolidates items into one checkout flow. That is the default for many e-commerce platforms.

This demo intentionally uses a per-vendor cart to showcase scoped context isolation. The app has a global cart context, and vendor routes override it with a vendor-specific context. Nested providers override parent contexts, so each vendor subtree gets its own cart instance while the rest of the app keeps the main cart.

When it makes sense:

- Food delivery: you cannot order from two restaurants in one delivery.
- Different fulfillment: each vendor ships separately with incompatible logistics.
- Different payment processors: each vendor handles its own payments.
- B2B wholesale: different terms, contracts, and minimums per supplier.
- White-label storefronts: each vendor is essentially its own branded store.

---

## Cart Architecture Overview

A well-architected cart system separates concerns cleanly. Here is how the pieces fit together:

```
Cart System Architecture:
=========================

+--------------------------------------------------------------+
|                          App Root                            |
|  +--------------------------------------------------------+  |
|  |                     CartProvider                       |  |
|  |  +--------------------------------------------------+  |  |
|  |  |  Reactive State ($state)                         |  |  |
|  |  |  - items: CartItem[]                             |  |  |
|  |  |  - appliedDiscount: AppliedDiscount | null        |  |  |
|  |  |  - isLoading: boolean                            |  |  |
|  |  +--------------------------------------------------+  |  |
|  |                           |                            |  |
|  |                           v                            |  |
|  |  +--------------------------------------------------+  |  |
|  |  |  Derived Calculations ($derived)                  |  |  |
|  |  |  - itemCount, totalQuantity                       |  |  |
|  |  |  - subtotal, discountAmount                       |  |  |
|  |  |  - shipping, tax                                  |  |  |
|  |  |  - total, isEmpty, summary                         |  |  |
|  |  +--------------------------------------------------+  |  |
|  |                           |                            |  |
|  |                           v                            |  |
|  |  +--------------------------------------------------+  |  |
|  |  |  Side Effects ($effect)                            |  |  |
|  |  |  - Persistence to localStorage                     |  |  |
|  |  +--------------------------------------------------+  |  |
|  |                                                      |  |  |
|  |  Context API (actions):                               |  |  |
|  |  - addItem(product, quantity, options)                |  |  |
|  |  - updateQuantity(itemId, quantity)                   |  |  |
|  |  - removeItem(itemId)                                 |  |  |
|  |  - applyDiscount(code) -> Promise<Result>             |  |  |
|  |  - removeDiscount()                                   |  |  |
|  |  - clearCart()                                        |  |  |
|  |                                                      |  |  |
|  |  Consumer Components                                  |  |  |
|  |  - ProductPage (addItem)                              |  |  |
|  |  - CartIcon (itemCount)                               |  |  |
|  |  - CartSummary (totals)                               |  |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+
```

The architecture follows a clear data flow: `$state` holds the source of truth, `$derived` computes secondary values, `$effect` handles side effects like persistence, and the context API exposes both state and actions to consumer components.

---

## Planning the Cart System

Before writing code, define what a production cart needs to handle. Thinking through requirements upfront leads to better API design.

### Core Requirements

| Category | Operations | Description |
| --- | --- | --- |
| Item management | Add, update, remove | Handle products with variants (size, color) |
| Quantity control | Increment, decrement, set | Respect stock limits, validate ranges |
| Calculations | Subtotal, tax, shipping, total | Reactive, automatic recalculation |
| Discounts | Apply, validate, remove | Server-validated promotional codes |
| Persistence | Save, load, sync | Survive page refreshes, optionally sync to server |
| Queries | Check contents, get quantities | Efficient lookups for UI state |

### Data Modeling Decisions

Several decisions affect how we model cart data:

- Item identity: a product ID alone is not sufficient when the same product has variants. We generate composite identifiers from product ID plus options.
- Price storage: store prices in cents as integers to avoid floating-point precision issues.
- Stock limits: enforce `maxQuantity` so users cannot add more than available stock.
- Calculations: all derived values compute through `$derived` so the UI stays consistent.
- Result objects: cart operations return typed result objects to make errors explicit and type-safe.

---

## What You Will Build

- A cart context with `$state`, `$derived`, and `$effect`.
- Safe persistence that loads before saving.
- A provider that scopes cart instances by tree position.
- UI components with bindable inputs and clear feedback.
- A complete multi-vendor marketplace with isolated carts per vendor.
- A discount validation endpoint.
- Multi-vendor rollups that keep isolation but show global totals.

---

## Step 1: Define the Cart Contract

The cart relies on explicit TypeScript types so every component sees the same contract. This keeps errors local and makes the API discoverable.

```ts
// src/lib/cart/types.ts
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
// src/lib/cart/cart-context.svelte.ts
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
// src/lib/cart/cart-context.svelte.ts
items = data.items.map((item: CartItem) => ({
	...item,
	addedAt: new SvelteDate(item.addedAt)
}));
```

### Derived Totals

All totals are computed with `$derived`. This makes every view consistent and avoids manual recalculation in UI code.

```ts
// src/lib/cart/cart-context.svelte.ts
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
// src/lib/cart/cart-context.svelte.ts
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
<!-- src/lib/cart/CartProvider.svelte -->
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
<!-- src/routes/+layout.svelte -->
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
<!-- src/lib/cart/QuantitySelector.svelte -->
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
<!-- src/lib/cart/AddToCartButton.svelte -->
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

## Step 6: Build the Multi-Vendor Marketplace

This section is the missing piece if you want readers to recreate the multi-vendor setup end-to-end. The goal is simple: the main app uses the default cart, but each vendor route overrides the cart with its own storage key and pricing rules.

### 6.1 Define Vendors and Products

Vendors are data, not logic. Each vendor carries currency, tax, and shipping settings, which become cart configuration later.

```ts
// src/lib/data/products.ts
export const vendors: Vendor[] = [
	{
		id: 'vendor-1',
		name: 'TechGear Pro',
		slug: 'techgear-pro',
		description: 'Premium electronics and gadgets for tech enthusiasts',
		logo: 'headphones',
		location: 'San Francisco, CA',
		currency: 'USD',
		taxRate: 0.0875,
		shippingCost: 799
	}
];

export function getVendor(slug: string): Vendor | undefined {
	return vendors.find((v) => v.slug === slug);
}

export function getProductsByVendor(vendorId: string): Product[] {
	return products.filter((p) => p.vendorId === vendorId);
}

export function getAllVendors(): Vendor[] {
	return vendors;
}
```

Why this matters:

- Vendor settings flow into cart configuration without special cases.
- The slug becomes the URL identifier and the lookup key.

### 6.2 Load the Vendor for Each Route

Each vendor page uses a server load function to look up the vendor by slug and provide typed data.

```ts
// src/routes/demo/(vendor)/marketplace/[vendor]/+layout.server.ts
import { error } from '@sveltejs/kit';
import { getVendor } from '$lib/data/products';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	const vendor = getVendor(params.vendor);

	if (!vendor) {
		throw error(404, `Vendor "${params.vendor}" not found`);
	}

	return { vendor };
};
```

Why this matters:

- The vendor data is available to all nested pages.
- Type-safe data prevents "property not found" errors in layouts.

### 6.3 Override the Cart per Vendor

Nest a new `CartProvider` and `WishlistProvider` inside the vendor layout. This overrides the parent context for the subtree only.

```svelte
<!-- src/routes/demo/(vendor)/marketplace/[vendor]/+layout.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte';
	import VendorHeader from '$lib/components/VendorHeader.svelte';
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<CartProvider
	storageKey="{data.vendor.id}-cart"
	currency={data.vendor.currency}
	taxRate={data.vendor.taxRate}
	shippingCost={data.vendor.shippingCost}
>
	<WishlistProvider storageKey="{data.vendor.id}-wishlist">
		<VendorHeader vendor={data.vendor} />
		{@render children()}
	</WishlistProvider>
</CartProvider>
```

Why this matters:

- Each vendor subtree gets its own cart and wishlist.
- Storage keys are unique per vendor, preventing collisions.

### 6.4 Add a Vendor Header with Scoped Navigation

The vendor header reads from the vendor object and routes to vendor-specific pages.

```svelte
<!-- src/lib/components/VendorHeader.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CartIcon from '$lib/cart/CartIcon.svelte';
	import { ROUTES } from '$lib/config/routes';
	import type { Vendor } from '$lib/data/products';
	import WishlistIcon from '$lib/wishlist/WishlistIcon.svelte';

	interface Props {
		vendor: Vendor;
	}

	let { vendor }: Props = $props();
</script>

<nav>
	<a href={ROUTES.vendor(vendor.slug)}>Products</a>
	<a href={ROUTES.vendorCart(vendor.slug)}>Cart</a>
	<a href={ROUTES.vendorWishlist(vendor.slug)}>Wishlist</a>
	<WishlistIcon onclick={() => goto(ROUTES.vendorWishlist(vendor.slug))} />
	<CartIcon onclick={() => goto(ROUTES.vendorCart(vendor.slug))} />
</nav>
```

Why this matters:

- Navigation is vendor-aware and stays inside the scoped context.
- Header icons read the vendor cart, not the global cart.

### 6.5 Build the Vendor Product Page

The vendor page lists products for that vendor and uses the shared `AddToCartButton` and `WishlistButton`.

```svelte
<!-- src/routes/demo/(vendor)/marketplace/[vendor]/+page.svelte -->
<script lang="ts">
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { getProductsByVendor } from '$lib/data/products';
	import { formatPrice } from '$lib/utils/formatting';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const products = $derived(getProductsByVendor(data.vendor.id));
</script>

{#each products as product (product.id)}
	<ProductCard {product} price={formatPrice(product.price, data.vendor.currency)} showTags={true}>
		{#snippet image()}
			<img src={product.image} alt={product.name} />
			<WishlistButton {product} />
		{/snippet}

		{#snippet actions()}
			<AddToCartButton {product} />
		{/snippet}
	</ProductCard>
{/each}
```

Why this matters:

- The product page is identical in behavior across vendors.
- The cart logic is scoped automatically by the layout.

### 6.6 Vendor Cart Page with Bindable Quantities

The vendor cart page uses `getCartContext()` and binds quantities directly to items.

```svelte
<!-- src/routes/demo/(vendor)/marketplace/[vendor]/cart/+page.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import CartSummary from '$lib/cart/CartSummary.svelte';
	import QuantitySelector from '$lib/cart/QuantitySelector.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const cart = getCartContext();

	function handleQuantityChange(itemId: string, quantity: number) {
		if (quantity <= 0) {
			cart.removeItem(itemId);
		} else {
			cart.updateQuantity(itemId, quantity);
		}
	}
</script>

{#each cart.items as item (item.id)}
	<QuantitySelector
		bind:value={item.quantity}
		max={item.product.maxQuantity}
		onchange={(qty) => handleQuantityChange(item.id, qty)}
	/>
{/each}

<CartSummary showHints={true} />
```

Why this matters:

- Binding keeps UI and cart state in sync.
- The cart summary always reflects the vendor-specific totals.

### 6.7 Vendor Wishlist Page and Move-to-Cart

Wishlists are scoped by vendor, but still allow moving items into the vendor cart.

```svelte
<!-- src/routes/demo/(vendor)/marketplace/[vendor]/wishlist/+page.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import { getWishlistContext } from '$lib/wishlist/wishlist-context.svelte';

	const wishlist = getWishlistContext();
	const cart = getCartContext();

	function moveToCart(productId: string) {
		const item = wishlist.items.find((i) => i.product.id === productId);
		if (item) {
			cart.addItem(item.product);
			wishlist.remove(productId);
		}
	}
</script>
```

Why this matters:

- Multi-context interaction is explicit and safe.
- The wishlist stays scoped while still serving cart workflows.

### 6.8 Marketplace Index and Vendor Links

The marketplace index lists vendors and links into their scoped subtrees.

```svelte
<!-- src/routes/demo/marketplace/+page.svelte -->
<script lang="ts">
	import { getAllVendors, getProductsByVendor } from '$lib/data/products';

	const vendors = getAllVendors();

	function getVendorProductCount(vendorId: string): number {
		return getProductsByVendor(vendorId).length;
	}
</script>

{#each vendors as vendor (vendor.id)}
	{@const productCount = getVendorProductCount(vendor.id)}
	<a href="/demo/marketplace/{vendor.slug}">
		<h3>{vendor.name}</h3>
		<span>{productCount} products</span>
	</a>
{/each}
```

Why this matters:

- The index is vendor-agnostic and just routes to scoped pages.
- All vendor behavior is driven by data, not branching logic.

---

## Step 7: Validate Discounts on the Server

Discount codes are validated by a server endpoint. The cart calls this endpoint via `couponEndpoint` in its options.

```ts
// src/routes/api/coupons/validate/+server.ts
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

## Step 8: Global Rollups Without Breaking Isolation

Vendor routes can override the cart provider with different storage keys, currencies, and shipping rules. To show a global summary, the app reads all vendor carts from localStorage and aggregates them.

```ts
// src/lib/cart/vendor-carts.svelte.ts
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

### 8.1 Build the All-Carts Page

The rollup page uses the summary helper to display totals and link back to each vendor cart and wishlist.

```svelte
<!-- src/routes/demo/marketplace/all-carts/+page.svelte -->
<script lang="ts">
	import { createVendorSummaries } from '$lib/cart/vendor-carts.svelte';
	import { onMount } from 'svelte';

	const allVendors = createVendorSummaries();

	onMount(() => {
		allVendors.refresh();
	});

	let grandTotalItems = $derived(allVendors.totalCartItems);
	let grandTotalWishlist = $derived(allVendors.totalWishlistItems);
</script>

{#each allVendors.summaries as summary (summary.vendor.id)}
	{#if summary.cart.itemCount > 0}
		<a href="/demo/marketplace/{summary.vendor.slug}/cart">Go to Cart →</a>
	{/if}
	{#if summary.wishlist.count > 0}
		<a href="/demo/marketplace/{summary.vendor.slug}/wishlist">Go to Wishlist →</a>
	{/if}
{/each}
```

Why this matters:

- Users get a global "where are my items" view.
- Each vendor still checks out independently.

---

## Step 9: Add a Wishlist Context

Wishlist is its own context with simpler rules. The pattern is the same, but the API is smaller.

```ts
// src/lib/wishlist/wishlist-context.svelte.ts
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
- A full multi-vendor marketplace with isolated carts and wishlists.
- Global rollups and a wishlist context that follow the same pattern.

If you want a guided walkthrough of specific pages, open the demo routes and trace how each page consumes `getCartContext()` and `getWishlistContext()`.
