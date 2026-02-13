<!-- src/lib/wishlist/WishlistButton.svelte -->
<script lang="ts">
	import type { CartProduct } from '$lib/cart/types';
	import { Heart } from 'lucide-svelte';
	import { getWishlistContext } from './wishlist-context.svelte';

	interface Props {
		product: CartProduct;
		showLabel?: boolean;
	}

	let { product, showLabel = false }: Props = $props();

	const wishlist = getWishlistContext();

	let isInWishlist = $derived(wishlist.has(product.id));
</script>

<button
	type="button"
	class="wishlist-btn"
	class:active={isInWishlist}
	onclick={() => wishlist.toggle(product)}
	aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
>
	<Heart
		size={20}
		fill={isInWishlist ? 'currentColor' : 'none'}
		stroke-width={2}
		aria-hidden="true"
	/>

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
</style>
