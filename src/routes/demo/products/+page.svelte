<!-- src/routes/demo/products/+page.svelte -->
<script lang="ts">
	import AddToCartButton from '$lib/cart/AddToCartButton.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { getAllProducts } from '$lib/data/products';
	import { formatPrice } from '$lib/utils/formatting';
	import WishlistButton from '$lib/wishlist/WishlistButton.svelte';

	const products = getAllProducts();
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
			<ProductCard
				{product}
				price={formatPrice(product.price)}
				showTags={false}
			>
				{@snippet image()}
					<img src={product.image} alt={product.name} />
					<div class="wishlist-btn">
						<WishlistButton {product} />
					</div>
				{/snippet}

				{@snippet actions()}
					<AddToCartButton {product} />
				{/snippet}
			</ProductCard>
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
