<!-- src/lib/cart/CartProvider.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createCartContext } from './cart-context.svelte';
	import type { CartOptions } from './types';

	interface Props extends CartOptions {
		/** Child content */
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

	// Create the cart context with provided options (untracked to capture initial values only)
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
