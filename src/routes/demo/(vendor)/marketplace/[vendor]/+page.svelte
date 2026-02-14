<!-- src/routes/demo/marketplace/[vendor]/+page.svelte -->
<script lang="ts">
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
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
					<VendorLogo icon={data.vendor.logo} size={48} stroke-width={2} />
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
					<ProductCard
						{product}
						price={formatPrice(product.price, data.vendor.currency)}
						showTags={true}
					>
						{#snippet image()}
							<img src={product.image} alt={product.name} />
							<div class="wishlist-action">
								<WishlistButton {product} />
							</div>
						{/snippet}

						{#snippet actions()}
							<AddToCartButton {product} />
						{/snippet}
					</ProductCard>
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
		background: rgb(249, 94, 38);
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
