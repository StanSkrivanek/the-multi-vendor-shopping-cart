<!-- src/lib/wishlist/WishlistIcon.svelte -->
<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { getWishlistContext } from './wishlist-context.svelte';

	interface Props {
		/** Click handler (e.g., to navigate to wishlist page) */
		onclick?: () => void;
	}

	let { onclick }: Props = $props();

	const wishlist = getWishlistContext();
</script>

<button
	type="button"
	class="wishlist-icon"
	{onclick}
	aria-label="Wishlist with {wishlist.count} items"
>
	<Heart
		size={24}
		fill={wishlist.count > 0 ? 'currentColor' : 'none'}
		stroke-width={2}
		aria-hidden="true"
	/>

	{#if wishlist.count > 0}
		<span class="badge" aria-hidden="true">
			{wishlist.count}
		</span>
	{/if}
</button>

<style>
	.wishlist-icon {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		color: var(--color-foreground, #1e293b);
		transition: color 0.2s;
	}

	.wishlist-icon:hover {
		color: var(--color-error, #dc2626);
	}

	.badge {
		position: absolute;
		top: 4px;
		right: 4px;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		font-size: 11px;
		font-weight: 600;
		line-height: 18px;
		text-align: center;
		color: white;
		background-color: var(--color-error, #dc2626);
		border-radius: 9px;
	}
</style>
