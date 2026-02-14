<!-- src/lib/cart/CartDrawer.svelte -->
<script lang="ts">
	import { ShoppingCart } from 'lucide-svelte';
	import { getCartContext } from './cart-context.svelte';
	import CartSummary from './CartSummary.svelte';
	import QuantitySelector from './QuantitySelector.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	const cart = getCartContext();

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: cart.currency
		}).format(cents / 100);
	}

	function handleQuantityChange(itemId: string, quantity: number) {
		if (quantity <= 0) {
			cart.removeItem(itemId);
		} else {
			cart.updateQuantity(itemId, quantity);
		}
	}
</script>

{#if open}
	<div
		class="drawer-backdrop"
		role="button"
		tabindex="0"
		aria-label="Close cart overlay"
		onclick={onclose}
		onkeydown={(event) => {
			if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onclose();
			}
		}}
	></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
	<aside class="cart-drawer" role="dialog" aria-label="Shopping cart" aria-modal="true">
		<header class="drawer-header">
			<h2>Your Cart ({cart.totalQuantity})</h2>
			<button type="button" class="close-btn" onclick={onclose} aria-label="Close cart">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</header>

		{#if cart.isEmpty}
			<div class="empty-cart">
				<div class="empty-icon">
					<ShoppingCart size={48} />
				</div>
				<p>Your cart is empty</p>
				<a href="/products" class="browse-btn" onclick={onclose}> Browse Products </a>
			</div>
		{:else}
			<ul class="cart-items">
				{#each cart.items as item (item.id)}
					<li class="cart-item">
						<div class="item-image-wrapper">
							{#if item.product.image}
								<img src={item.product.image} alt="" class="item-image" />
							{:else}
								<div class="item-image-placeholder">
									{item.product.name.charAt(0)}
								</div>
							{/if}
						</div>

						<div class="item-content">
							<div class="item-header">
								<h3 class="item-name">{item.product.name}</h3>
								<button
									type="button"
									class="remove-btn"
									onclick={() => cart.removeItem(item.id)}
									aria-label="Remove {item.product.name} from cart"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
							</div>

							{#if Object.keys(item.options).length > 0}
								<p class="item-options">
									{Object.entries(item.options)
										.filter(([_, v]) => v)
										.map(([k, v]) => `${k}: ${v}`)
										.join(' • ')}
								</p>
							{/if}

							<p class="item-price">{formatPrice(item.product.price)} each</p>

							<div class="item-footer">
								<QuantitySelector
									bind:value={item.quantity}
									max={item.product.maxQuantity}
									onchange={(qty) => handleQuantityChange(item.id, qty)}
									compact
								/>

								<span class="line-total">
									{formatPrice(item.lineTotal)}
								</span>
							</div>
						</div>
					</li>
				{/each}
			</ul>

			<div class="drawer-footer">
				<CartSummary showBreakdown={false} showDiscountInput={false} />

				<div class="footer-actions">
					<a href="/cart" class="view-cart-btn" onclick={onclose}> View Full Cart </a>

					<a href="/checkout" class="checkout-btn" onclick={onclose}> Proceed to Checkout </a>
				</div>

				<button type="button" class="clear-btn" onclick={() => cart.clearCart()}>
					Clear Cart
				</button>
			</div>
		{/if}
	</aside>
{/if}

<style>
	.drawer-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 40;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.cart-drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		max-width: 440px;
		background: white;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
		z-index: 50;
		display: flex;
		flex-direction: column;
		animation: slideIn 0.3s ease;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
		flex-shrink: 0;
	}

	.drawer-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.close-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s;
	}

	.close-btn svg {
		width: 20px;
		height: 20px;
	}

	.close-btn:hover {
		background: var(--color-surface, #f1f5f9);
	}

	.empty-cart {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
		opacity: 0.3;
	}

	.empty-cart p {
		color: var(--color-muted, #64748b);
		margin: 0;
	}

	.browse-btn {
		padding: 0.75rem 1.5rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.browse-btn:hover {
		background: var(--color-primary-hover, #2563eb);
	}

	.cart-items {
		flex: 1;
		overflow-y: auto;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.cart-item {
		display: flex;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.item-image-wrapper {
		flex-shrink: 0;
	}

	.item-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 8px;
		background: var(--color-surface, #f1f5f9);
	}

	.item-image-placeholder {
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-surface, #f1f5f9);
		border-radius: 8px;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-muted, #64748b);
	}

	.item-content {
		flex: 1;
		min-width: 0;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.item-name {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
	}

	.remove-btn {
		padding: 0.25rem;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.4;
		transition: opacity 0.2s;
	}

	.remove-btn svg {
		width: 16px;
		height: 16px;
	}

	.remove-btn:hover {
		opacity: 1;
		color: var(--color-error, #dc2626);
	}

	.item-options {
		margin: 0.25rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-muted, #64748b);
	}

	.item-price {
		margin: 0.25rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-muted, #64748b);
	}

	.item-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 0.75rem;
	}

	.line-total {
		font-weight: 600;
	}

	.drawer-footer {
		padding: 1.5rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
		background: var(--color-surface, #f8fafc);
		flex-shrink: 0;
	}

	.footer-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.view-cart-btn,
	.checkout-btn {
		flex: 1;
		padding: 0.875rem;
		text-align: center;
		text-decoration: none;
		font-weight: 600;
		border-radius: 8px;
		transition: background-color 0.2s;
	}

	.view-cart-btn {
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		color: var(--color-foreground, #1e293b);
	}

	.view-cart-btn:hover {
		background: var(--color-surface-hover, #f1f5f9);
	}

	.checkout-btn {
		background: var(--color-primary, #3b82f6);
		color: white;
	}

	.checkout-btn:hover {
		background: var(--color-primary-hover, #2563eb);
	}

	.clear-btn {
		display: block;
		width: 100%;
		padding: 0.625rem;
		margin-top: 0.75rem;
		background: transparent;
		border: none;
		color: var(--color-muted, #64748b);
		font-size: 0.875rem;
		cursor: pointer;
		transition: color 0.2s;
	}

	.clear-btn:hover {
		color: var(--color-error, #dc2626);
	}
</style>
