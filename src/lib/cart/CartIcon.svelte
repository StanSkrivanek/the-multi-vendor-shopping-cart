<!-- src/lib/cart/CartIcon.svelte -->
<script lang="ts">
	import { ShoppingCart } from 'lucide-svelte';
	import { getCartContext } from './cart-context.svelte';

	interface Props {
		/** Click handler (e.g., to open cart drawer) */
		onclick?: () => void;
	}

	let { onclick }: Props = $props();

	const cart = getCartContext();

	// Format badge for display (cap at 99+)
	let badgeText = $derived(cart.totalQuantity > 99 ? '99+' : String(cart.totalQuantity));
</script>

<button
	type="button"
	class="cart-icon"
	{onclick}
	aria-label="Shopping cart with {cart.totalQuantity} items"
>
	<ShoppingCart size={24} stroke-width={2} aria-hidden="true" />

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
		/* flex-shrink: 0;
		outline: none; */
	}

	.cart-icon:hover {
		color: var(--color-primary, #3b82f6);
	}

	.cart-icon:focus-visible {
		outline: 2px solid var(--color-primary, #3b82f6);
		outline-offset: 2px;
		border-radius: 4px;
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
