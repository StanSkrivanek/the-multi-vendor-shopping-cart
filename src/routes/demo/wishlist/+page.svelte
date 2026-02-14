<!-- src/routes/demo/wishlist/+page.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { formatPrice } from '$lib/utils/formatting';
	import { getWishlistContext } from '$lib/wishlist/wishlist-context.svelte';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';
	import { Heart } from 'lucide-svelte';

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

<svelte:head>
	<title>My Wishlist - Hackpile Store</title>
</svelte:head>

<div class="wishlist-page">
	<div class="page-header">
		<h1>Your Wishlist</h1>
		<p class="vendor-name">Your saved items from all vendors</p>
	</div>

	{#if wishlist.isEmpty}
		<div class="empty-state">
			<div class="empty-icon">
				<Heart size={48} />
			</div>
			<h2>Your wishlist is empty</h2>
			<p>Save your favorite products to come back to them later</p>
			<a href="/demo/products" class="browse-btn">Browse Products</a>
		</div>
	{:else}
		<div class="wishlist-header">
			<p class="item-count">{wishlist.count} {wishlist.count === 1 ? 'item' : 'items'}</p>
			<button class="clear-btn" onclick={() => wishlist.clear()}>Clear All</button>
		</div>

		<div class="wishlist-grid">
			{#each wishlist.items as { product } (product.id)}
				<ProductCard {product} price={formatPrice(product.price)} variant="wishlist">
					{@snippet image()}
						{#if product.image}
							<img src={product.image} alt={product.name} />
						{:else}
							<div class="image-placeholder">
								{product.name.charAt(0)}
							</div>
						{/if}
						<div class="wishlist-icon">
							<WishlistButton {product} />
						</div>
					{/snippet}

					{@snippet meta()}
						{#if product.sku}
							<p class="product-sku">SKU: {product.sku}</p>
						{/if}
					{/snippet}

					{@snippet actions()}
						<button class="add-to-cart-btn" onclick={() => moveToCart(product.id)}>
							Add to Cart
						</button>
						<button class="view-btn" onclick={() => (window.location.href = '/demo/products')}>
							View Product
						</button>
					{/snippet}
				</ProductCard>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wishlist-page {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.vendor-name {
		font-size: 1rem;
		color: var(--color-muted, #64748b);
	}

	.wishlist-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
	}

	.add-to-cart-btn {
		width: 100%;
		padding: 0.75rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.add-to-cart-btn:hover {
		background: var(--color-primary-dark, #2563eb);
	}

	.view-btn {
		width: 100%;
		padding: 0.75rem;
		background: white;
		color: var(--color-primary, #3b82f6);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.view-btn:hover {
		background: var(--color-surface, #f8fafc);
		border-color: var(--color-primary, #3b82f6);
	}

	@media (max-width: 768px) {
		.wishlist-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			gap: 1.5rem;
		}
	}
</style>
