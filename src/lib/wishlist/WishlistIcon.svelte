<!-- src/lib/wishlist/WishlistIcon.svelte -->
<script lang="ts">
	import { getWishlistContext } from './wishlist-context.svelte'

	interface Props {
		/** Click handler (e.g., to navigate to wishlist page) */
		onclick?: () => void
	}

	let { onclick }: Props = $props()

	const wishlist = getWishlistContext()
</script>

<button
	type="button"
	class="wishlist-icon"
	{onclick}
	aria-label="Wishlist with {wishlist.count} items"
>
	<svg
		viewBox="0 0 24 24"
		fill={wishlist.count > 0 ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		/>
	</svg>

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

	.wishlist-icon svg {
		width: 24px;
		height: 24px;
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
