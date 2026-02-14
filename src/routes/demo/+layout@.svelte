<!-- src/routes/demo/+layout@.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte';
	import Header from '$lib/components/Header.svelte';
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte';
	import '../../app.css';

	let { children } = $props();
</script>

<!-- Demo-specific contexts (isolated from root) -->
<CartProvider taxRate={0.08} freeShippingThreshold={7500} currency="USD">
	<WishlistProvider>
		<Header />
		<main class="demo-layout">
			{@render children()}
		</main>
	</WishlistProvider>
</CartProvider>

<style>
	.demo-layout {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1.5rem;
	}
</style>
