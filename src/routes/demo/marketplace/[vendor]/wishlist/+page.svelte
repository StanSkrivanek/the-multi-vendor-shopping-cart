<!-- src/routes/demo/marketplace/[vendor]/wishlist/+page.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import { getWishlistContext } from '$lib/wishlist/wishlist-context.svelte';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const wishlist = getWishlistContext();
	const cart = getCartContext();

	function formatPrice(cents: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(cents / 100);
	}

	function moveToCart(productId: string) {
		const item = wishlist.items.find((i) => i.product.id === productId);
		if (item) {
			cart.addItem(item.product);
			wishlist.remove(productId);
		}
	}
</script>

<svelte:head>
	<title>Wishlist - {data.vendor.name}</title>
</svelte:head>

<div class="wishlist-page">
	<div class="page-header">
		<h1>Your Wishlist</h1>
		<p class="vendor-name">Saved items from {data.vendor.name}</p>
	</div>

	{#if wishlist.isEmpty}
		<div class="empty-state">
			<div class="empty-icon">💝</div>
			<h2>Your wishlist is empty</h2>
			<p>Save your favorite products from {data.vendor.name} to come back to them later</p>
			<a href="/demo/marketplace/{data.vendor.slug}" class="browse-btn"> Browse Products </a>
		</div>
	{:else}
		<div class="wishlist-header">
			<p class="item-count">{wishlist.count} {wishlist.count === 1 ? 'item' : 'items'}</p>
			<button class="clear-btn" onclick={() => wishlist.clear()}> Clear All </button>
		</div>

		<div class="wishlist-grid">
			{#each wishlist.items as { product } (product.id)}
				<article class="wishlist-card">
					<div class="card-image">
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
					</div>

					<div class="card-content">
						<h3 class="product-name">{product.name}</h3>
						{#if product.sku}
							<p class="product-sku">SKU: {product.sku}</p>
						{/if}
						<div class="product-price">
							{formatPrice(product.price, data.vendor.currency)}
						</div>

						<div class="card-actions">
							<button class="add-to-cart-btn" onclick={() => moveToCart(product.id)}>
								Add to Cart
							</button>
							<button
								class="view-btn"
								onclick={() => (window.location.href = `/demo/marketplace/${data.vendor.slug}`)}
							>
								View Product
							</button>
						</div>
					</div>
				</article>
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

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.empty-state p {
		color: var(--color-muted, #64748b);
		margin-bottom: 1.5rem;
	}

	.browse-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: background 0.2s;
	}

	.browse-btn:hover {
		background: var(--color-primary-dark, #2563eb);
	}

	.wishlist-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1rem 1.5rem;
		background: white;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.item-count {
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-foreground, #1e293b);
	}

	.clear-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		color: var(--color-muted, #64748b);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: var(--color-surface, #f8fafc);
		border-color: var(--color-muted, #64748b);
	}

	.wishlist-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
	}

	.wishlist-card {
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
		overflow: hidden;
		transition: box-shadow 0.2s;
	}

	.wishlist-card:hover {
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		position: relative;
		width: 100%;
		height: 240px;
		background: var(--color-surface, #f8fafc);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		font-weight: 700;
		color: var(--color-muted, #64748b);
	}

	.wishlist-icon {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
	}

	.card-content {
		padding: 1.25rem;
	}

	.product-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.product-sku {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
		margin-bottom: 0.75rem;
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
		margin-bottom: 1rem;
	}

	.card-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

		.card-image {
			height: 200px;
		}
	}
</style>
