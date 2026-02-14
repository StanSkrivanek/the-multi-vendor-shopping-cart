<!-- src/lib/cart/AddToCartButton.svelte -->
<script lang="ts">
	import { getCartContext } from './cart-context.svelte';
	import type { CartProduct, CartItemOptions } from './types';

	interface Props {
		/** Product data to add */
		product: CartProduct;

		/** Quantity to add (default: 1) */
		quantity?: number;

		/** Selected variant options */
		options?: CartItemOptions;

		/** Additional CSS classes */
		class?: string;
	}

	let { product, quantity = 1, options = {}, class: className = '' }: Props = $props();

	const cart = getCartContext();

	// Button states
	// IMPORTANT: Cannot use 'state' as variable name when using $state rune
	// The variable name would conflict with the rune itself
	type ButtonState = 'idle' | 'adding' | 'added' | 'error';
	let buttonState = $state<ButtonState>('idle');
	let errorMessage = $state('');

	// Check if this product/variant is already in the cart
	let isInCart = $derived(cart.hasItem(product.id, options));
	let cartQuantity = $derived(cart.getQuantity(product.id, options));

	/**
	 * Handles the add to cart action with visual feedback.
	 */
	async function handleAdd() {
		buttonState = 'adding';

		// Small delay for visual feedback
		await new Promise((resolve) => setTimeout(resolve, 200));

		const result = cart.addItem(product, quantity, options);

		if (result.success) {
			buttonState = 'added';

			// Reset to idle after showing success
			setTimeout(() => {
				buttonState = 'idle';
			}, 2000);
		} else {
			buttonState = 'error';
			errorMessage = result.message ?? 'Could not add to cart';

			// Reset to idle after showing error
			setTimeout(() => {
				buttonState = 'idle';
				errorMessage = '';
			}, 3000);
		}
	}
</script>

<button
	type="button"
	class="add-to-cart {className}"
	class:adding={buttonState === 'adding'}
	class:added={buttonState === 'added'}
	class:error={buttonState === 'error'}
	class:in-cart={isInCart && buttonState === 'idle'}
	onclick={handleAdd}
	disabled={buttonState === 'adding'}
>
	{#if buttonState === 'adding'}
		<span class="spinner" aria-hidden="true"></span>
		<span>Adding...</span>
	{:else if buttonState === 'added'}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<polyline points="20 6 9 17 4 12" />
		</svg>
		<span>Added!</span>
	{:else if buttonState === 'error'}
		<span>{errorMessage}</span>
	{:else if isInCart}
		<span>In Cart ({cartQuantity})</span>
	{:else}
		<span>Add to Cart</span>
	{/if}
</button>

<style>
	.add-to-cart {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		min-width: 140px;
		font-size: 0.9375rem;
		font-weight: 500;
		color: white;
		background-color: var(--color-primary, #3b82f6);
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-to-cart:hover:not(:disabled) {
		background-color: var(--color-primary-hover, #2563eb);
	}

	.add-to-cart:disabled {
		cursor: not-allowed;
		opacity: 0.8;
	}

	.add-to-cart.added {
		background-color: var(--color-success, #16a34a);
	}

	.add-to-cart.error {
		background-color: var(--color-error, #dc2626);
	}

	.add-to-cart.in-cart {
		background-color: var(--color-muted, #64748b);
	}

	.add-to-cart svg {
		width: 18px;
		height: 18px;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
