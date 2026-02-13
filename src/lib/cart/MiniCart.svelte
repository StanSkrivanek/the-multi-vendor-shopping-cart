<!-- src/lib/cart/MiniCart.svelte -->
<script lang="ts">
	import { getCartContext } from './cart-context.svelte'

	const cart = getCartContext()

	let isOpen = $state(false)

	function formatPrice(cents: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: cart.currency
		}).format(cents / 100)
	}

	function close() {
		isOpen = false
	}
</script>

<div class="mini-cart">
	<button
		class="cart-toggle"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		aria-haspopup="dialog"
	>
		<span class="cart-icon">🛒</span>
		{#if cart.itemCount > 0}
			<span class="badge">{cart.totalQuantity}</span>
		{/if}
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="backdrop" onclick={close}></div>

		<div class="cart-dropdown" role="dialog" aria-label="Shopping cart preview">
			<header class="dropdown-header">
				<h3>Your Cart</h3>
				<button type="button" class="close-btn" onclick={close} aria-label="Close cart preview">
					×
				</button>
			</header>

			{#if cart.isEmpty}
				<div class="empty-state">
					<p>Your cart is empty</p>
					<a href="/products" onclick={close}>Browse products</a>
				</div>
			{:else}
				<ul class="items">
					{#each cart.items as item (item.id)}
						<li class="item">
							{#if item.product.image}
								<img src={item.product.image} alt="" class="item-image" />
							{/if}

							<div class="item-details">
								<span class="item-name">{item.product.name}</span>
								{#if Object.keys(item.options).length > 0}
									<span class="item-options">
										{Object.values(item.options).filter(Boolean).join(', ')}
									</span>
								{/if}
								<span class="item-qty">Qty: {item.quantity}</span>
							</div>

							<span class="item-price">{formatPrice(item.lineTotal)}</span>

							<button
								type="button"
								class="remove-btn"
								onclick={() => cart.removeItem(item.id)}
								aria-label="Remove {item.product.name}"
							>
								×
							</button>
						</li>
					{/each}
				</ul>

				<div class="dropdown-footer">
					<div class="totals">
						<span>Subtotal</span>
						<span class="subtotal">{formatPrice(cart.summary.subtotal)}</span>
					</div>

					<a href="/cart" class="view-cart-btn" onclick={close}> View Cart </a>

					<a href="/checkout" class="checkout-btn" onclick={close}> Checkout </a>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.mini-cart {
		position: relative;
	}

	.cart-toggle {
		position: relative;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.5rem;
	}

	.badge {
		position: absolute;
		top: 0;
		right: 0;
		background-color: var(--color-primary, #3b82f6);
		color: white;
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		border-radius: 999px;
		font-weight: 600;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
	}

	.cart-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		width: 340px;
		background-color: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 12px;
		box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
		z-index: 50;
		overflow: hidden;
	}

	.dropdown-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.dropdown-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.empty-state {
		padding: 2rem;
		text-align: center;
		color: var(--color-muted, #64748b);
	}

	.empty-state a {
		color: var(--color-primary, #3b82f6);
		text-decoration: none;
		font-weight: 500;
	}

	.items {
		list-style: none;
		padding: 0;
		margin: 0;
		max-height: 300px;
		overflow-y: auto;
	}

	.item {
		display: grid;
		grid-template-columns: 56px 1fr auto auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
	}

	.item:last-child {
		border-bottom: none;
	}

	.item-image {
		width: 56px;
		height: 56px;
		object-fit: cover;
		border-radius: 6px;
		background: var(--color-surface, #f8fafc);
	}

	.item-details {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.item-name {
		font-weight: 500;
		font-size: 0.875rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-options {
		font-size: 0.75rem;
		color: var(--color-muted, #64748b);
	}

	.item-qty {
		font-size: 0.75rem;
		color: var(--color-muted, #64748b);
	}

	.item-price {
		font-weight: 600;
		font-size: 0.875rem;
	}

	.remove-btn {
		background: none;
		border: none;
		color: var(--color-muted, #64748b);
		cursor: pointer;
		font-size: 1.25rem;
		padding: 0.25rem;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.remove-btn:hover {
		opacity: 1;
		color: var(--color-error, #dc2626);
	}

	.dropdown-footer {
		padding: 1rem;
		background: var(--color-surface, #f8fafc);
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.totals {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.subtotal {
		font-weight: 700;
	}

	.view-cart-btn,
	.checkout-btn {
		display: block;
		text-align: center;
		padding: 0.75rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.view-cart-btn {
		margin-bottom: 0.5rem;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		color: var(--color-foreground, #1e293b);
	}

	.view-cart-btn:hover {
		background: var(--color-surface-hover, #f1f5f9);
	}

	.checkout-btn {
		background-color: var(--color-primary, #3b82f6);
		color: white;
	}

	.checkout-btn:hover {
		background-color: var(--color-primary-hover, #2563eb);
	}
</style>