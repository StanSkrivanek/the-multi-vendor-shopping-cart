<!-- src/routes/demo/wishlist/+page.svelte -->
<script lang="ts">
	import { getWishlistContext } from '$lib/wishlist/wishlist-context.svelte'
	import { getCartContext } from '$lib/cart/cart-context.svelte'

	const wishlist = getWishlistContext()
	const cart = getCartContext()

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100)
	}

	/**
	 * Moves an item from wishlist to cart.
	 * This demonstrates cross-context operations.
	 */
	function moveToCart(productId: string) {
		const item = wishlist.items.find((i) => i.product.id === productId)
		if (item) {
			// Add to cart
			cart.addItem(item.product)
			// Remove from wishlist
			wishlist.remove(productId)
		}
	}
</script>

<div class="wishlist-page">
	<h1>My Wishlist ({wishlist.count})</h1>

	{#if wishlist.isEmpty}
		<div class="empty-state">
			<p>Your wishlist is empty</p>
			<a href="/demo/products">Browse Products</a>
		</div>
	{:else}
		<div class="wishlist-grid">
			{#each wishlist.items as { product } (product.id)}
				<div class="wishlist-item">
					<h3>{product.name}</h3>
					<p class="price">{formatPrice(product.price)}</p>

					<div class="actions">
						<button onclick={() => moveToCart(product.id)}> Move to Cart </button>

						<button onclick={() => wishlist.remove(product.id)}> Remove </button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>