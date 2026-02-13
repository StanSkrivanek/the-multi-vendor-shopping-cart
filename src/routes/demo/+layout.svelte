<!-- src/routes/demo/+layout.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte'
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte'
	import Header from '$lib/components/Header.svelte'

	let { children } = $props()
</script>

<!-- Multiple independent contexts: Cart and Wishlist -->
<CartProvider taxRate={0.08} freeShippingThreshold={7500} currency="USD">
	<WishlistProvider storageKey="demo-wishlist">
		<Header />
		<main class="demo-layout">
			{@render children()}
		</main>
	</WishlistProvider>
</CartProvider>