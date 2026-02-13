# Svelte 5 Optimization Opportunities

## 1. Extract Price Formatting Utility ⭐ HIGH PRIORITY

**Issue**: Price formatting is duplicated across `CartSummary`, wishlist pages, and vendor pages.

**Files affected**:

- `src/lib/cart/CartSummary.svelte` (lines 44-50)
- `src/routes/demo/wishlist/+page.svelte` (lines 9-14)
- `src/routes/demo/marketplace/[vendor]/wishlist/+page.svelte` (lines 11-16)
- `src/routes/demo/cart/+page.svelte`

**Optimization**:

```typescript
// src/lib/utils/formatting.ts
export function formatPrice(cents: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(cents / 100);
}
```

**Impact**: Reduces code duplication by ~50 lines across components.

---

## 2. Simplify Context Getters Using $state Snapshot

**Issue**: Cart and Wishlist contexts use verbose getters for simple state access.

**Current pattern** (verbose):

```typescript
const context: CartContext = {
	get items() {
		return items;
	},
	get summary() {
		return summary;
	},
	get isEmpty() {
		return isEmpty;
	}
	// ... 8+ more getters
};
```

**Modern Svelte 5 pattern**:

```typescript
// Just return the state directly - $state values are reactive proxies
const context: CartContext = {
	items, // Direct reference to $state array
	summary, // Direct reference to $derived value
	isEmpty // Direct reference to $derived value
	// ... simpler!
};
```

**Impact**: Removes ~30 lines of boilerplate from `cart-context.svelte.ts` and `wishlist-context.svelte.ts`.

---

## 3. Replace onMount() with $effect.pre()

**Issue**: Using `onMount()` for initial storage load is older pattern.

**Current code** (in cart-context.svelte.ts):

```typescript
onMount(() => {
	loadFromStorage();
});
```

**Modern pattern**:

```typescript
$effect.pre(() => {
	if (!browser || isInitialized) return;
	loadFromStorage();
	isInitialized = true;
});
```

**Why**: `$effect.pre()` is more precise for initialization logic in Svelte 5.

**Impact**: Aligns with modern Svelte 5 best practices, slightly cleaner initialization flow.

---

## 4. Replace SvelteDate with Native Date

**Issue**: Using `SvelteDate` unnecessarily adds complexity.

**Files affected**:

- `src/lib/wishlist/wishlist-context.svelte.ts` (line 2)
- `src/lib/wishlist/wishlist-context.svelte.ts` (line 20)

**Change**:

```typescript
// From:
import { SvelteDate } from 'svelte/reactivity';
addedAt: new SvelteDate();

// To:
addedAt: new Date(); // Native Date works fine with $state
```

**Impact**: Removes unnecessary dependency, 1 line.

---

## 5. Use Two-Way Binding in QuantitySelector

**Issue**: QuantitySelector uses callback pattern instead of modern binding.

**Current code** (QuantitySelector.svelte):

```typescript
let { value, onchange }: Props = $props()

function handleInput(event: Event) {
	const input = event.target as HTMLInputElement
	let newValue = parseInt(input.value, 10)
	// ... validation
	onchange(newValue)
}

<input {value} oninput={handleInput} />
```

**Modern Svelte 5 pattern**:

```typescript
let { value = $bindable(1) }: Props = $props()

<input bind:value />
```

**Impact**: Simplifies component API, consumers use `bind:quantity` instead of managing state themselves.

---

## 6. Simplify Navigation Handlers

**Issue**: Similar navigation patterns repeated in multiple components.

**Current pattern** (Header.svelte):

```typescript
<WishlistIcon onclick={() => goto('/demo/wishlist')} />
<CartIcon onclick={() => goto('/demo/cart')} />
```

**Optimization**: Create helper function:

```typescript
// src/lib/utils/navigation.ts
export const routes = {
	wishlist: '/demo/wishlist',
	cart: '/demo/cart',
	marketplace: '/demo/marketplace'
} as const;

// Usage:
<WishlistIcon onclick={() => goto(routes.wishlist)} />
```

**Impact**: Type-safe routes, easier maintenance, consistent navigation.

---

## 7. Extract Product Card as Snippet Component

**Issue**: Product card markup is repeated in marketplace, products, and vendor pages.

**Opportunity**: Create reusable snippet for product cards with consistent styling:

```svelte
<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
	import type { CartProduct } from '$lib/cart/types';
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';

	interface Props {
		product: CartProduct;
		snippet?: Snippet<[product: CartProduct]>;
	}

	let { product }: Props = $props();
</script>

<div class="product-card">
	<div class="product-image">
		<img src={product.image} alt={product.name} />
		<div class="product-actions">
			<WishlistButton {product} />
		</div>
	</div>
	<div class="product-info">
		<h3>{product.name}</h3>
		<p class="product-price">{formatPrice(product.price)}</p>
		<AddToCartButton {product} />
	</div>
</div>
```

**Impact**: ~100 lines of duplicated markup eliminated.

---

## 8. Remove Unused Imports

**Files to check**:

- Header.svelte: Has unused imports
- CartProvider.svelte: `fs.appendFile` import should be removed

**Quick win**: ~5 imports to clean up.

---

## 9. Consolidate Demo Pages Layout

**Opportunity**: Many demo pages repeat the same header/layout pattern. Could use layout groups or shared layout component.

---

## 10. Type-Safe Route Constants

**Current issue**: Routes are hardcoded strings throughout codebase.

**Solution**:

```typescript
// src/lib/config/routes.ts
export const DEMO_ROUTES = {
	HOME: '/',
	PRODUCTS: '/demo/products',
	MARKETPLACE: '/demo/marketplace',
	CART: '/demo/cart',
	WISHLIST: '/demo/wishlist',
	VENDOR: (slug: string) => `/demo/marketplace/${slug}`,
	VENDOR_CART: (slug: string) => `/demo/marketplace/${slug}/cart`,
	VENDOR_WISHLIST: (slug: string) => `/demo/marketplace/${slug}/wishlist`
} as const;
```

**Impact**: Type-safe navigation, easier refactoring, single source of truth.

---

## Implementation Priority

### Quick Wins (< 30 minutes):

1. Extract price formatting utility ✓
2. Remove SvelteDate usage ✓
3. Clean up unused imports ✓
4. Create route constants ✓

### Medium Effort (30-60 minutes):

5. Simplify context getters ✓
6. Replace onMount with $effect.pre ✓
7. Replace navigation pattern ✓

### Larger Refactors (1-2 hours):

8. Product card snippet component ✓
9. Two-way binding in QuantitySelector ✓
10. Consolidate layouts ✓

---

## Notes

- All changes maintain backward compatibility
- No breaking changes to public APIs
- Follows Svelte 5 best practices
- Improves code maintainability significantly
