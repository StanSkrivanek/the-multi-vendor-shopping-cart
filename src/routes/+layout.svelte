<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte';
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<!-- Root app contexts -->
<CartProvider taxRate={0.08} freeShippingThreshold={7500} currency="USD">
	<WishlistProvider>
		<main>
			{@render children()}
		</main>
	</WishlistProvider>
</CartProvider>
