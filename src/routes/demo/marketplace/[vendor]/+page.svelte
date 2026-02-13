<!-- src/routes/demo/marketplace/[vendor]/+page.svelte -->
<script lang="ts">
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import VendorLogo from '$lib/components/VendorLogo.svelte';
	import { getProductsByVendor } from '$lib/data/products';
	import { formatPrice } from '$lib/utils/formatting';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';
	import { MapPin } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const products = $derived(getProductsByVendor(data.vendor.id));
</script>

<svelte:head>
	<title>{data.vendor.name} - Marketplace</title>
</svelte:head>

<div class="vendor-page">
	<div class="vendor-hero">
		<div class="hero-content">
			{#if data.vendor.logo}
				<div class="vendor-logo-large">
					<VendorLogo icon={data.vendor.logo} size={48} />
				</div>
			{/if}
			<h1>{data.vendor.name}</h1>
			<p class="vendor-description">{data.vendor.description}</p>
			{#if data.vendor.location}
				<p class="vendor-location">
					<MapPin size={18} />
					{data.vendor.location}
				</p>
			{/if}
		</div>
	</div>

	<div class="products-section">
		<h2>Products</h2>

		{#if products.length === 0}
			<div class="empty-state">
				<p>No products available yet.</p>
			</div>
		{:else}
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

							<div class="product-tags">
								{#each product.tags.slice(0, 3) as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>

							<div class="product-footer">
								<div class="product-price">
									{formatPrice(product.price, data.vendor.currency)}
								</div>
								<AddToCartButton {product} />
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.vendor-page {
		margin-bottom: 3rem;
	}

	.vendor-hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 3rem 1.5rem;
		border-radius: 0.75rem;
		margin-bottom: 2rem;
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.vendor-logo-large {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
		color: white;
	}

	.vendor-hero h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.vendor-description {
		font-size: 1.25rem;
		opacity: 0.95;
		margin-bottom: 0.5rem;
	}

	.vendor-location {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 1rem;
		opacity: 0.85;
	}

	.products-section h2 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: var(--color-foreground, #1e293b);
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

	.product-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: var(--color-surface, #f1f5f9);
		color: var(--color-muted, #64748b);
		border-radius: 0.25rem;
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

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--color-muted, #64748b);
	}

	@media (max-width: 768px) {
		.vendor-hero {
			padding: 2rem 1rem;
		}

		.vendor-hero h1 {
			font-size: 2rem;
		}

		.vendor-logo-large {
			font-size: 4rem;
		}

		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}
	}
</style>
