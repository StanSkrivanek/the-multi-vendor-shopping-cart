<!-- src/lib/wishlist/WishlistButton.svelte -->
<script lang="ts">
	import { getWishlistContext } from './wishlist-context.svelte'
	import type { CartProduct } from '$lib/cart/types'

	interface Props {
		product: CartProduct
		showLabel?: boolean
	}

	let { product, showLabel = false }: Props = $props()

	const wishlist = getWishlistContext()

	let isInWishlist = $derived(wishlist.has(product.id))
</script>

<button
	type="button"
	class="wishlist-btn"
	class:active={isInWishlist}
	onclick={() => wishlist.toggle(product)}
	aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
>
	<!-- Heart SVG icon -->
	<svg
		viewBox="0 0 24 24"
		fill={isInWishlist ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		/>
	</svg>

	{#if showLabel}
		<span>{isInWishlist ? 'Saved' : 'Save'}</span>
	{/if}
</button>

<style>
	.wishlist-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		border: 1px solid #e2e8f0;
		background: white;
		border-radius: 8px;
		cursor: pointer;
		color: #64748b;
		transition: all 0.2s;
	}

	.wishlist-btn:hover,
	.wishlist-btn.active {
		color: #dc2626;
		border-color: #dc2626;
		background: #fef2f2;
	}

	.wishlist-btn svg {
		width: 20px;
		height: 20px;
	}
</style>