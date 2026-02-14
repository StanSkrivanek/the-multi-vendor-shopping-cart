<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
	import type { CartProduct } from '$lib/cart/types';
	import type { Snippet } from 'svelte';

	type ProductLike = CartProduct & {
		category?: string;
		description?: string;
		tags?: string[];
	};

	interface Props {
		product: ProductLike;
		price: string;
		variant?: 'product' | 'wishlist';
		category?: string;
		description?: string;
		tags?: string[];
		showTags?: boolean;
		maxTags?: number;
		image?: Snippet;
		meta?: Snippet;
		actions?: Snippet;
	}

	let {
		product,
		price,
		variant = 'product',
		category = product.category,
		description = product.description,
		tags = product.tags ?? [],
		showTags = false,
		maxTags = 3,
		image,
		meta,
		actions
	}: Props = $props();

	const isWishlist = $derived(variant === 'wishlist');
	const visibleTags = $derived(showTags ? tags.slice(0, maxTags) : []);
</script>

<article class={isWishlist ? 'wishlist-card' : 'product-card'}>
	<div class={isWishlist ? 'card-image' : 'product-image'}>
		{@render image?.()}
	</div>

	<div class={isWishlist ? 'card-content' : 'product-info'}>
		{#if !isWishlist && category}
			<div class="product-category">{category}</div>
		{/if}

		<h3 class="product-name">{product.name}</h3>

		{#if isWishlist}
			{@render meta?.()}
		{:else}
			{#if description}
				<p class="product-description">{description}</p>
			{/if}
			{#if visibleTags.length > 0}
				<div class="product-tags">
					{#each visibleTags as tag (tag)}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		{/if}

		{#if isWishlist}
			<div class="product-price wishlist-price">{price}</div>
			{#if actions}
				<div class="card-actions">
					{@render actions()}
				</div>
			{/if}
		{:else}
			<div class="product-footer">
				<div class="product-price">{price}</div>
				{@render actions?.()}
			</div>
		{/if}
	</div>
</article>

<style>
	.product-card,
	.wishlist-card {
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		overflow: hidden;
		transition: box-shadow 0.2s;
	}

	.product-card {
		border-radius: 0.5rem;
	}

	.wishlist-card {
		border-radius: 0.75rem;
	}

	.product-card:hover,
	.wishlist-card:hover {
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	}

	.product-image,
	.card-image {
		position: relative;
		width: 100%;
		overflow: hidden;
		background: var(--color-background, #f8fafc);
	}

	.product-image {
		height: 250px;
	}

	.card-image {
		height: 240px;
	}

	:global(.product-image img),
	:global(.card-image img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	:global(.image-placeholder) {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
		font-weight: 700;
		color: var(--color-muted, #64748b);
	}

	:global(.wishlist-btn),
	:global(.wishlist-icon) {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
	}

	.product-info,
	.card-content {
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
		font-size: 1.125rem;
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

	:global(.product-sku) {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
		margin-bottom: 0.75rem;
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

	.wishlist-price {
		margin-bottom: 1rem;
	}

	.card-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (max-width: 768px) {
		.card-image {
			height: 200px;
		}
	}
</style>
