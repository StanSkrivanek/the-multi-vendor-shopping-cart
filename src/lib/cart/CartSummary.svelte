<!-- src/lib/cart/CartSummary.svelte -->
<script lang="ts">
	import { formatPrice } from '$lib/utils/formatting';
	import { Lightbulb } from 'lucide-svelte';
	import { getCartContext } from './cart-context.svelte';

	interface Props {
		/** Show shipping row */
		showShipping?: boolean;

		/** Show discount input */
		showDiscountInput?: boolean;

		/** Show item breakdown */
		showBreakdown?: boolean;

		/** Show discount code hints */
		showHints?: boolean;
	}

	let {
		showShipping = true,
		showDiscountInput = true,
		showBreakdown = true,
		showHints = true
	}: Props = $props();

	const cart = getCartContext();

	// Discount code input state
	let discountCode = $state('');
	let discountError = $state('');
	let showAllHints = $state(false);

	// Demo discount codes for hints
	const discountHints = [
		{ code: 'SAVE10', description: '10% off' },
		{ code: 'SAVE20', description: '20% off orders $50+' },
		{ code: 'FLAT5', description: '$5 off' },
		{ code: 'WELCOME', description: '15% off' },
		{ code: 'FREESHIP', description: 'Free shipping' }
	];

	/**
	 * Handles discount code submission.
	 */
	async function handleApplyDiscount() {
		discountError = '';

		const result = await cart.applyDiscount(discountCode);

		if (result.success) {
			discountCode = '';
		} else {
			discountError = result.error ?? 'Invalid code';
		}
	}

	/**
	 * Apply a hint code directly
	 */
	function applyHintCode(code: string) {
		discountCode = code;
		handleApplyDiscount();
	}
</script>

<div class="cart-summary">
	<h2 class="summary-title">Order Summary</h2>

	<dl class="summary-rows">
		{#if showBreakdown}
			<div class="summary-row">
				<dt>Subtotal ({cart.summary.totalQuantity} items)</dt>
				<dd>{formatPrice(cart.summary.subtotal)}</dd>
			</div>
		{/if}

		{#if cart.appliedDiscount}
			<div class="summary-row discount-row">
				<dt>
					Discount
					<span class="discount-code">({cart.appliedDiscount.code})</span>
					<button
						type="button"
						class="remove-discount"
						onclick={() => cart.removeDiscount()}
						aria-label="Remove discount"
					>
						×
					</button>
				</dt>
				<dd class="discount-amount">-{formatPrice(cart.summary.discount)}</dd>
			</div>
		{/if}

		{#if showShipping}
			<div class="summary-row">
				<dt>Shipping</dt>
				<dd>
					{#if cart.summary.shipping === 0}
						<span class="free-shipping">Free</span>
					{:else}
						{formatPrice(cart.summary.shipping)}
					{/if}
				</dd>
			</div>
		{/if}

		{#if showBreakdown}
			<div class="summary-row">
				<dt>Tax</dt>
				<dd>{formatPrice(cart.summary.tax)}</dd>
			</div>
		{/if}

		<div class="summary-row total-row">
			<dt>Total</dt>
			<dd class="total-amount">{formatPrice(cart.summary.total)}</dd>
		</div>
	</dl>

	{#if showDiscountInput && !cart.appliedDiscount}
		<div class="discount-form">
			<label for="discount-code" class="visually-hidden"> Discount code </label>

			<div class="discount-input-group">
				<input
					type="text"
					id="discount-code"
					bind:value={discountCode}
					placeholder="Discount code"
					disabled={cart.isLoading}
				/>
				<button
					type="button"
					onclick={handleApplyDiscount}
					disabled={cart.isLoading || !discountCode.trim()}
				>
					{cart.isLoading ? 'Applying...' : 'Apply'}
				</button>
			</div>

			{#if discountError}
				<p class="discount-error" role="alert">{discountError}</p>
			{/if}

			{#if showHints}
				<div class="discount-hints">
					<button type="button" class="hints-toggle" onclick={() => (showAllHints = !showAllHints)}>
						<span class="hints-icon"><Lightbulb size={16} /></span>
						{showAllHints ? 'Hide' : 'Show'} demo codes
					</button>

					{#if showAllHints}
						<div class="hints-list">
							{#each discountHints as hint (hint.code)}
								<button type="button" class="hint-chip" onclick={() => applyHintCode(hint.code)}>
									<span class="hint-code">{hint.code}</span>
									<span class="hint-desc">{hint.description}</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cart-summary {
		background: var(--color-surface, #f8fafc);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.summary-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}

	.summary-rows {
		margin: 0;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		padding: 0.625rem 0;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.summary-row:last-child {
		border-bottom: none;
	}

	.summary-row dt {
		color: var(--color-muted, #64748b);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.summary-row dd {
		margin: 0;
		font-weight: 500;
	}

	.discount-row {
		color: var(--color-success, #16a34a);
	}

	.discount-code {
		font-size: 0.8125rem;
		text-transform: uppercase;
	}

	.remove-discount {
		padding: 0 0.25rem;
		border: none;
		background: transparent;
		font-size: 1.125rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.remove-discount:hover {
		opacity: 1;
	}

	.discount-amount {
		color: var(--color-success, #16a34a);
	}

	.free-shipping {
		color: var(--color-success, #16a34a);
		font-weight: 500;
	}

	.total-row {
		padding-top: 1rem;
		margin-top: 0.5rem;
		border-top: 2px solid var(--color-border, #e2e8f0);
		border-bottom: none;
	}

	.total-row dt {
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
	}

	.total-amount {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
	}

	.discount-form {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.discount-input-group {
		display: flex;
		gap: 0.5rem;
	}

	.discount-input-group input {
		flex: 1;
		padding: 0.625rem 0.875rem;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		font-size: 0.9375rem;
	}

	.discount-input-group input:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px var(--color-primary-ring, rgba(59, 130, 246, 0.2));
	}

	.discount-input-group button {
		padding: 0.625rem 1rem;
		background: var(--color-foreground, #1e293b);
		color: white;
		border: none;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.discount-input-group button:hover:not(:disabled) {
		background: var(--color-foreground-hover, #334155);
	}

	.discount-input-group button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.discount-error {
		margin: 0.5rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-error, #dc2626);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.discount-hints {
		margin-top: 0.75rem;
	}

	.hints-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0;
		border: none;
		background: none;
		font-size: 0.8125rem;
		color: var(--color-muted, #64748b);
		cursor: pointer;
		transition: color 0.2s;
	}

	.hints-toggle:hover {
		color: var(--color-primary, #3b82f6);
	}

	.hints-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.hint-chip {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.125rem;
		padding: 0.5rem 0.75rem;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.hint-chip:hover {
		border-color: var(--color-primary, #3b82f6);
		background: #eff6ff;
	}

	.hint-code {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-primary, #3b82f6);
	}

	.hint-desc {
		font-size: 0.6875rem;
		color: var(--color-muted, #64748b);
	}
</style>
