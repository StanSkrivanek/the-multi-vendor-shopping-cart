<!-- src/lib/cart/QuantitySelector.svelte -->
<script lang="ts">
	interface Props {
		/** Current quantity */
		value?: number;

		/** Minimum allowed (default: 1) */
		min?: number;

		/** Maximum allowed (optional stock limit) */
		max?: number;

		/** Called when quantity changes */
		onchange?: (quantity: number) => void;

		/** Disable all controls */
		disabled?: boolean;

		/** Compact size variant */
		compact?: boolean;
	}

	let {
		value = $bindable(1),
		min = 1,
		max,
		onchange,
		disabled = false,
		compact = false
	}: Props = $props();

	let canDecrement = $derived(value > min && !disabled);
	let canIncrement = $derived((!max || value < max) && !disabled);

	function decrement() {
		if (canDecrement) {
			value -= 1;
			onchange?.(value);
		}
	}

	function increment() {
		if (canIncrement) {
			value += 1;
			onchange?.(value);
		}
	}

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		let newValue = parseInt(input.value, 10);

		// Clamp to valid range
		if (isNaN(newValue) || newValue < min) {
			newValue = min;
		} else if (max && newValue > max) {
			newValue = max;
		}

		value = newValue;
		onchange?.(value);
	}
</script>

<div class="quantity-selector" class:disabled class:compact>
	<button
		type="button"
		class="qty-btn"
		onclick={decrement}
		disabled={!canDecrement}
		aria-label="Decrease quantity"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	</button>

	<input
		type="number"
		class="qty-input"
		bind:value
		{min}
		{max}
		{disabled}
		oninput={handleInput}
		aria-label="Quantity"
	/>

	<button
		type="button"
		class="qty-btn"
		onclick={increment}
		disabled={!canIncrement}
		aria-label="Increase quantity"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	</button>
</div>

<style>
	.quantity-selector {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		overflow: hidden;
	}

	.quantity-selector.disabled {
		opacity: 0.5;
	}

	.qty-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: none;
		background: var(--color-surface, #f8fafc);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.compact .qty-btn {
		width: 28px;
		height: 28px;
	}

	.qty-btn:hover:not(:disabled) {
		background: var(--color-surface-hover, #e2e8f0);
	}

	.qty-btn:disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}

	.qty-btn svg {
		width: 16px;
		height: 16px;
		color: var(--color-foreground, #1e293b);
	}

	.compact .qty-btn svg {
		width: 12px;
		height: 12px;
	}

	.qty-input {
		width: 48px;
		height: 36px;
		padding: 0;
		border: none;
		border-left: 1px solid var(--color-border, #e2e8f0);
		border-right: 1px solid var(--color-border, #e2e8f0);
		text-align: center;
		font-size: 0.9375rem;
		font-weight: 500;
		background: white;
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.compact .qty-input {
		width: 36px;
		height: 28px;
		font-size: 0.8125rem;
	}

	.qty-input::-webkit-outer-spin-button,
	.qty-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.qty-input:focus {
		outline: none;
		background: var(--color-primary-ring, rgba(59, 130, 246, 0.1));
	}
</style>
