<!-- src/routes/demo/products/+page.svelte -->
<script lang="ts">
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import { getAllProducts } from '$lib/data/products';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';

	const products = getAllProducts();

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(cents / 100);
	}
</script>

<svelte:head>
	<title>Products - Hackpile Store</title>
</svelte:head>

<div class="products-page">
	<div class="page-header">
		<h1>All Products</h1>
		<p>Browse our complete collection from all vendors</p>
	</div>

	<div class="products-grid">
		{#each products as product (product.id)}
			<article class="product-card">
				<div class="product-image">
					<img src={product.image} alt={product.name} />
					<div class="wishlist-btn">
						<WishlistButton {product} />
					</div>
				</div>

				<div class="product-info">
					<div class="product-category">{product.category}</div>
					<h3 class="product-name">{product.name}</h3>
					<p class="product-description">{product.description}</p>

					<div class="product-footer">
						<div class="product-price">{formatPrice(product.price)}</div>
						<AddToCartButton {product} />
					</div>
				</div>
			</article>
		{/each}
	</div>
</div>

<style>
	.products-page {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.page-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.page-header p {
		font-size: 1.125rem;
		color: var(--color-muted, #64748b);
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 2rem;
	}

	.product-card {
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.5rem;
		overflow: hidden;
		transition: box-shadow 0.2s;
	}

	.product-card:hover {
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.product-image {
		position: relative;
		width: 100%;
		height: 250px;
		overflow: hidden;
		background: var(--color-background, #f8fafc);
	}

	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wishlist-btn {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
	}

	.product-info {
		padding: 1.25rem;
	}

	.product-category {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-primary, #3b82f6);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.product-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	.product-description {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
		line-height: 1.5;
		margin-bottom: 1rem;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.product-price {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
	}

	@media (max-width: 768px) {
		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}
	}
</style>
