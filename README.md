# Svelte 5 Shopping Cart System Demo

> **A comprehensive demonstration of building a production-ready shopping cart using Svelte 5's Context API and reactive primitives.**

This project showcases modern state management patterns in Svelte 5, featuring reactive calculations, automatic persistence, and context-based scoped isolation. Built as a companion to the article series on **The Hackpile Chronicles**.

## Key Features

- **Reactive State Management** – Built with Svelte 5's `$state`, `$derived`, and `$effect` runes
- **Context-Based Architecture** – Scoped cart instances using Svelte's context API
- **Automatic Persistence** – LocalStorage integration with corruption-safe loading
- **Smart Calculations** – Automatic totals, tax, shipping, and discount application
- **Multi-Vendor Support** – Isolated carts per vendor with cross-cart summaries
- **Type-Safe API** – Full TypeScript coverage with detailed type definitions
- **Discount System** – Server-validated coupon codes (percentage & fixed)
- **Wishlist Integration** – Parallel wishlist context with similar patterns

## Architecture Overview

The cart system uses **Svelte 5 context** to provide scoped, reactive state that's independent of component hierarchy:

```typescript
// Create isolated cart context
createCartContext({
	storageKey: 'vendor-1-cart', // Isolate by vendor
	taxRate: 0.0875, // Auto-calculate tax
	shippingCost: 799, // Smart shipping logic
	freeShippingThreshold: 5000 // Free shipping rules
});

// Access from any child component
const cart = getCartContext();
cart.addItem(product, quantity);
```

### Why Context Over Stores?

1. **Scoped Isolation** – Multiple independent cart instances on one page
2. **No Global State Pollution** – Each vendor gets its own cart context
3. **Cleaner Component Model** – No need to pass stores through props
4. **Built-in SSR Safety** – Context naturally scoped to component tree

## Core Features Demonstrated

### 1. **Reactive Calculations** (`$derived`)

```typescript
const subtotal = $derived(items.reduce((sum, item) => sum + item.lineTotal, 0));

const tax = $derived(Math.round(afterDiscount * taxRate));
const total = $derived(afterDiscount + shipping + tax);
```

All calculations automatically update when items change. No manual tracking needed.

### 2. **Automatic Persistence** (`$effect`)

```typescript
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

Cart state automatically syncs to localStorage whenever it changes.

### 3. **Scoped Multi-Vendor Carts**

Each vendor gets its own isolated cart context:

```
/marketplace/techgear-pro/    → techgear-pro-cart
/marketplace/artisan-crafts/  → artisan-crafts-cart
```

Users can shop from multiple vendors simultaneously without cart conflicts.

### 4. **Server-Validated Discounts**

```typescript
async applyDiscount(code: string): Promise<DiscountResult> {
  const response = await fetch('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  });
  // Apply validated discount...
}
```

## Project Structure

```
src/lib/
  cart/
    cart-context.svelte.ts      # Main cart context implementation
    vendor-carts.svelte.ts      # Cross-vendor cart aggregation
    types.ts                    # TypeScript definitions
    CartProvider.svelte         # Context provider component
    CartSummary.svelte          # Cart display component
    AddToCartButton.svelte      # Add to cart UI
    QuantitySelector.svelte     # Quantity controls
    CartIcon.svelte             # Cart badge with count

  wishlist/
    wishlist-context.svelte.ts  # Parallel wishlist implementation
    types.ts                    # Wishlist types
    WishlistProvider.svelte     # Wishlist context provider

  data/
    products.ts                 # Sample vendor & product data

  config/
    routes.ts                   # Route configuration

src/routes/
  demo/
    +page.svelte               # Demo landing page
    (vendor)/                  # Vendor-specific routes
      +layout@.svelte          # Vendor layout with context
      marketplace/[vendor]/    # Dynamic vendor pages
        +page.svelte           # Product listing
        cart/+page.svelte      # Vendor cart page
        wishlist/+page.svelte  # Vendor wishlist page
    marketplace/
      all-carts/+page.svelte   # Cross-vendor cart summary

  api/
    coupons/validate/
      +server.ts               # Discount validation endpoint
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone or download this demo
git clone <repository-url>
cd sv-cart

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Explore the Demo

Visit the following routes to see different features:

- **`/demo`** – Demo home with feature overview
- **`/demo/marketplace/techgear-pro`** – Shop TechGear Pro products
- **`/demo/marketplace/techgear-pro/cart`** – View TechGear cart
- **`/demo/marketplace/artisan-crafts`** – Shop Artisan Crafts products
- **`/demo/marketplace/all-carts`** – See all vendor carts together

## Usage Examples

### Creating a Cart Context

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { createCartContext } from '$lib/cart/cart-context.svelte';
	import { CartProvider } from '$lib/cart';

	createCartContext({
		storageKey: 'my-cart',
		taxRate: 0.08,
		shippingCost: 599,
		freeShippingThreshold: 5000
	});
</script>

<!-- Children can now access cart context -->
<slot />
```

### Using Cart in Components

```svelte
<!-- ProductCard.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';

	const cart = getCartContext();
	const { product } = $props();

	function addToCart() {
		const result = cart.addItem(product, 1);
		if (!result.success) {
			alert(result.message);
		}
	}
</script>

<button onclick={addToCart}>
	Add to Cart ({cart.itemCount})
</button>
```

### Reactive Calculations

```svelte
<script lang="ts">
	const cart = getCartContext();
</script>

<div class="cart-summary">
	<div>Subtotal: ${(cart.summary.subtotal / 100).toFixed(2)}</div>
	<div>Tax: ${(cart.summary.tax / 100).toFixed(2)}</div>
	<div>Shipping: ${(cart.summary.shipping / 100).toFixed(2)}</div>
	<hr />
	<div>Total: ${(cart.summary.total / 100).toFixed(2)}</div>
</div>
```

All values automatically update when cart changes!

## Key Concepts Demonstrated

### 1. **Svelte 5 Runes**

- `$state` – Reactive primitive state
- `$derived` – Computed values that auto-update
- `$derived.by()` – Complex derived computations
- `$effect` – Side effects (persistence, logging)
- `$effect.pre()` – Pre-render effects (loading data)

### 2. **Context API Pattern**

- `setContext()` – Provide cart instance to children
- `getContext()` – Access cart from any descendant
- `hasContext()` – Safely check context availability
- Symbol keys – Prevent context collisions

### 3. **State Management Best Practices**

- Separate concerns (cart logic vs UI)
- Validation at the boundary (API surface)
- Immutable updates (spread operators for arrays)
- Loading states for async operations
- Error handling with typed results

### 4. **TypeScript Integration**

- Discriminated unions for results
- Strict null checking
- Generic constraints
- Readonly getters for state access

## Configuration Options

```typescript
interface CartOptions {
	storageKey?: string; // localStorage key (default: 'cart')
	currency?: string; // Currency code (default: 'USD')
	taxRate?: number; // Tax rate as decimal (default: 0.08)
	shippingCost?: number; // Flat rate in cents (default: 599)
	freeShippingThreshold?: number; // Free shipping minimum (default: 5000)
	couponEndpoint?: string; // API endpoint (default: '/api/coupons/validate')
	calculateShipping?: (subtotal: number, itemCount: number) => number;
}
```

## API Reference

### Cart Context Methods

```typescript
interface CartContext {
	// State (readonly)
	items: CartItem[];
	summary: CartSummary;
	isEmpty: boolean;
	isLoading: boolean;
	appliedDiscount: AppliedDiscount | null;
	itemCount: number;
	totalQuantity: number;

	// Actions
	addItem(product: CartProduct, quantity?: number, options?: CartItemOptions): AddItemResult;
	updateQuantity(id: string, quantity: number): UpdateQuantityResult;
	removeItem(id: string): void;
	clearCart(): void;
	getItem(productId: string, options?: CartItemOptions): CartItem | undefined;
	hasItem(productId: string, options?: CartItemOptions): boolean;
	getQuantity(productId: string, options?: CartItemOptions): number;
	applyDiscount(code: string): Promise<DiscountResult>;
	removeDiscount(): void;
}
```

## Testing the Features

### Feature Checklist

- Add items to cart and see quantity badges update
- Increase/decrease quantities with QuantitySelector
- Remove items from cart
- Apply discount code `SAVE10` (10% off)
- Apply discount code `FLAT500` ($5 off)
- Watch shipping become free at $50+ subtotal
- Visit different vendor pages – see isolated carts
- Refresh page – cart persists from localStorage
- Add items to wishlist, toggle favorites
- View cross-vendor summary at `/demo/marketplace/all-carts`

### Test Discount Codes

- `SAVE10` – 10% off entire order
- `SAVE20` – 20% off entire order
- `FLAT500` – $5 flat discount
- `FLAT1000` – $10 flat discount

## Related Resources

- **Article Series**: The Hackpile Chronicles
- **Svelte 5 Docs**: [Svelte Runes](https://svelte-5-preview.vercel.app/docs/runes)
- **Context API**: [Svelte Context](https://svelte.dev/docs/svelte/context)

## License

This project is provided as-is for educational purposes. Feel free to use the code in your own projects.

---

**Built with Svelte 5, SvelteKit, TypeScript, and love**
