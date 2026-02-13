<!-- src/lib/cart/CartIcon.svelte -->
<script lang="ts">
	import { getCartContext } from './cart-context.svelte'

	interface Props {
		/** Click handler (e.g., to open cart drawer) */
		onclick?: () => void
	}

	let { onclick }: Props = $props()

	const cart = getCartContext()

	// Format badge for display (cap at 99+)
	let badgeText = $derived(cart.totalQuantity > 99 ? '99+' : String(cart.totalQuantity))
</script>

<button
	type="button"
	class="cart-icon"
	{onclick}
	aria-label="Shopping cart with {cart.totalQuantity} items"
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="9" cy="21" r="1" />
		<circle cx="20" cy="21" r="1" />
		<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
	</svg>

	{#if cart.totalQuantity > 0}
		<span class="badge" aria-hidden="true">
			{badgeText}
		</span>
	{/if}
</button>

<style>
	.cart-icon {
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

	.cart-icon:hover {
		color: var(--color-primary, #3b82f6);
	}

	.cart-icon svg {
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
		background-color: var(--color-primary, #3b82f6);
		border-radius: 9px;
	}
</style>