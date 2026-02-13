<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte';
	import Header from '$lib/components/Header.svelte';
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>
<!-- <CartProvider taxRate={0.08} freeShippingThreshold={7500} currency="USD">
	<WishlistProvider>
		<Header /> -->
		<main>
			{@render children()}
		</main>
	<!-- </WishlistProvider>
</CartProvider> -->
