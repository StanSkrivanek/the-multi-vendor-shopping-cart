<!-- src/routes/demo/marketplace/[vendor]/cart/+page.svelte -->
<script lang="ts">
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import CartSummary from '$lib/cart/CartSummary.svelte';
	import QuantitySelector from '$lib/cart/QuantitySelector.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const cart = getCartContext();

	function formatPrice(cents: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
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

<svelte:head>
	<title>Cart - {data.vendor.name}</title>
</svelte:head>

<div class="cart-page">
	<div class="page-header">
		<h1>Your Cart</h1>
		<p class="vendor-name">Shopping at {data.vendor.name}</p>
	</div>

	{#if cart.isEmpty}
		<div class="empty-state">
			<div class="empty-icon">🛒</div>
			<h2>Your cart is empty</h2>
			<p>Browse products from {data.vendor.name} to get started</p>
			<a href="/demo/marketplace/{data.vendor.slug}" class="browse-btn"> Browse Products </a>
		</div>
	{:else}
		<div class="cart-content">
			<div class="cart-items">
				<div class="items-header">
					<h2>Items ({cart.totalQuantity})</h2>
					<button class="clear-btn" onclick={() => cart.clearCart()}> Clear Cart </button>
				</div>

				<div class="items-list">
					{#each cart.items as item (item.id)}
						<article class="cart-item">
							<div class="item-image">
								{#if item.product.image}
									<img src={item.product.image} alt={item.product.name} />
								{:else}
									<div class="image-placeholder">
										{item.product.name.charAt(0)}
									</div>
								{/if}
							</div>

							<div class="item-details">
								<h3 class="item-name">{item.product.name}</h3>
								{#if item.product.sku}
									<p class="item-sku">SKU: {item.product.sku}</p>
								{/if}
								{#if Object.keys(item.options).length > 0}
									<div class="item-options">
										{#each Object.entries(item.options).filter(([_, v]) => v) as [key, value]}
											<span class="option">{key}: {value}</span>
										{/each}
									</div>
								{/if}
								<p class="item-price">
									{formatPrice(item.product.price, data.vendor.currency)} each
								</p>
							</div>

							<div class="item-actions">
								<QuantitySelector
									value={item.quantity}
									max={item.product.maxQuantity}
									onchange={(qty) => handleQuantityChange(item.id, qty)}
								/>
								<div class="item-total">
									{formatPrice(item.lineTotal, data.vendor.currency)}
								</div>
								<button
									class="remove-btn"
									onclick={() => cart.removeItem(item.id)}
									aria-label="Remove {item.product.name}"
								>
									Remove
								</button>
							</div>
						</article>
					{/each}
				</div>
			</div>

			<div class="cart-sidebar">
				<CartSummary showHints={true} />

				<div class="checkout-actions">
					<button class="checkout-btn"> Proceed to Checkout </button>
					<a href="/demo/marketplace/{data.vendor.slug}" class="continue-shopping">
						← Continue Shopping
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.cart-page {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.vendor-name {
		font-size: 1rem;
		color: var(--color-muted, #64748b);
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-state h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.empty-state p {
		color: var(--color-muted, #64748b);
		margin-bottom: 1.5rem;
	}

	.browse-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: background 0.2s;
	}

	.browse-btn:hover {
		background: var(--color-primary-dark, #2563eb);
	}

	.cart-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
	}

	.cart-items {
		background: white;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #e2e8f0);
		padding: 1.5rem;
	}

	.items-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.items-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
	}

	.clear-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.375rem;
		color: var(--color-muted, #64748b);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		background: var(--color-surface, #f8fafc);
		border-color: var(--color-muted, #64748b);
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.cart-item {
		display: grid;
		grid-template-columns: 120px 1fr auto;
		gap: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.cart-item:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.item-image {
		width: 120px;
		height: 120px;
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--color-surface, #f8fafc);
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-muted, #64748b);
	}

	.item-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
	}

	.item-sku {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
	}

	.item-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.option {
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		background: var(--color-surface, #f1f5f9);
		border-radius: 0.25rem;
		color: var(--color-muted, #64748b);
	}

	.item-price {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
	}

	.item-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.item-total {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
	}

	.remove-btn {
		padding: 0.5rem 1rem;
		background: none;
		border: none;
		color: var(--color-danger, #ef4444);
		font-size: 0.875rem;
		cursor: pointer;
		text-decoration: underline;
	}

	.remove-btn:hover {
		color: var(--color-danger-dark, #dc2626);
	}

	.cart-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.checkout-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.checkout-btn {
		width: 100%;
		padding: 1rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.checkout-btn:hover {
		background: var(--color-primary-dark, #2563eb);
	}

	.continue-shopping {
		text-align: center;
		padding: 0.75rem;
		color: var(--color-primary, #3b82f6);
		text-decoration: none;
		font-weight: 500;
	}

	.continue-shopping:hover {
		text-decoration: underline;
	}

	@media (max-width: 1024px) {
		.cart-content {
			grid-template-columns: 1fr;
		}

		.cart-sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.cart-item {
			grid-template-columns: 80px 1fr;
			gap: 1rem;
		}

		.item-image {
			width: 80px;
			height: 80px;
		}

		.item-actions {
			grid-column: 1 / -1;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
