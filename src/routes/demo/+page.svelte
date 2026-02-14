<!-- src/routes/demo/+page.svelte -->
<script>
	import { getCartContext } from '$lib/cart/cart-context.svelte';
	import { createVendorSummaries } from '$lib/cart/vendor-carts.svelte';
	import { formatPrice } from '$lib/utils/formatting';
	import { Heart, Package, ShoppingCart, Store } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const cart = getCartContext();
	const allVendors = createVendorSummaries();

	onMount(() => {
		allVendors.refresh();
	});
</script>

<div class="demo-home">
	<div class="hero">
		<h1>Shopping Cart Demo</h1>
		<p class="subtitle">A production-grade shopping cart built with Svelte 5 Context API</p>

		<div class="stats-section">
			<!-- Global Cart Stats -->
			<div class="stats">
				<div class="stat-card">
					<div class="stat-icon">
						<ShoppingCart size={24} />
					</div>
					<div class="stat-value">{cart.itemCount}</div>
					<div class="stat-label">Items in Cart</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon">
						<Package size={24} />
					</div>
					<div class="stat-value">{cart.totalQuantity}</div>
					<div class="stat-label">Total Units</div>
				</div>
			</div>

			<!-- Vendor Carts/Wishlists Summary -->
			{#if allVendors.vendorsWithItems.length > 0}
				<div class="vendor-summary">
					<h3>
						<Store size={20} />
						Active Vendors ({allVendors.vendorsWithItems.length})
					</h3>
					<div class="vendor-list">
						{#each allVendors.vendorsWithItems as summary (summary.vendor.id)}
							<a href="/demo/marketplace/{summary.vendor.slug}" class="vendor-item">
								<div class="vendor-item-header">
									<span class="vendor-name">{summary.vendor.name}</span>
								</div>
								<div class="vendor-item-stats">
									{#if summary.cart.itemCount > 0}
										<span class="vendor-stat">
											<ShoppingCart size={14} />
											{summary.cart.totalQuantity} items
										</span>
									{/if}
									{#if summary.wishlist.count > 0}
										<span class="vendor-stat wishlist">
											<Heart size={14} />
											{summary.wishlist.count}
										</span>
									{/if}
								</div>
								{#if summary.cart.subtotal > 0}
									<div class="vendor-subtotal">
										{formatPrice(summary.cart.subtotal, summary.vendor.currency)}
									</div>
								{/if}
							</a>
						{/each}
					</div>
					<a href="/demo/marketplace/all-carts" class="view-all-link">View All Carts →</a>
				</div>
			{/if}
		</div>
	</div>

	<div class="features">
		<h2>Features Demonstrated</h2>

		<div class="feature-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<ShoppingCart size={32} />
				</div>
				<h3>Main Store</h3>
				<p>Browse all products with the main cart context</p>
				<a href="/demo/products" class="feature-link">View Products →</a>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Store size={32} />
				</div>
				<h3>Multi-Vendor Marketplace</h3>
				<p>Scoped cart isolation with vendor-specific settings</p>
				<a href="/demo/marketplace" class="feature-link">Browse Vendors →</a>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Package size={32} />
				</div>
				<h3>View Cart</h3>
				<p>See your cart items with full summary and checkout</p>
				<a href="/demo/cart" class="feature-link">Go to Cart →</a>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Heart size={32} />
				</div>
				<h3>Wishlist</h3>
				<p>Multiple contexts working together: save items for later</p>
				<a href="/demo/wishlist" class="feature-link">View Wishlist →</a>
			</div>
		</div>
	</div>

	<div class="technical-features">
		<h2>Technical Features</h2>
		<ul>
			<li><strong>Reactive State</strong>: Automatic UI updates using $state, $derived</li>
			<li><strong>Type-Safe Operations</strong>: Result objects for explicit error handling</li>
			<li><strong>Persistent Storage</strong>: localStorage with $effect</li>
			<li><strong>Multiple Contexts</strong>: Independent cart and wishlist contexts</li>
			<li><strong>Scoped Isolation</strong>: Separate carts for different vendors</li>
			<li><strong>Stock Management</strong>: Quantity limits and validation</li>
			<li><strong>Discount Codes</strong>: Server-validated promotional codes</li>
			<li><strong>Tax & Shipping</strong>: Automatic calculations with free shipping thresholds</li>
		</ul>
	</div>
</div>

<style>
	.demo-home {
		max-width: 1280px;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 4rem;
	}

	.hero h1 {
		margin: 0 0 1rem;
		font-size: 3rem;
		font-weight: 800;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		margin: 0 0 2rem;
		font-size: 1.25rem;
		color: var(--color-muted, #64748b);
	}

	.stats-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}

	.stats {
		display: flex;
		gap: 2rem;
		justify-content: center;
	}

	.stat-card {
		padding: 1.5rem 2rem;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 12px;
		min-width: 140px;
		text-align: center;
	}

	.stat-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		margin: 0 auto 0.5rem;
		background: hsl(221.2 83.2% 53.3% / 0.1);
		border-radius: 8px;
		color: hsl(221.2 83.2% 53.3%);
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-primary, #3b82f6);
		margin-bottom: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Vendor Summary Section */
	.vendor-summary {
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 12px;
		padding: 1.5rem;
		width: 100%;
		max-width: 600px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.vendor-summary h3 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0 0 1.25rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
	}

	.vendor-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.vendor-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: #f8fafc;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s;
		gap: 1rem;
	}

	.vendor-item:hover {
		background: #f1f5f9;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
	}

	.vendor-item-header {
		flex: 1;
		min-width: 0;
	}

	.vendor-name {
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vendor-item-stats {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.vendor-stat {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.875rem;
		color: var(--color-primary, #3b82f6);
		font-weight: 500;
	}

	.vendor-stat.wishlist {
		color: #ec4899;
	}

	.vendor-subtotal {
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
		white-space: nowrap;
	}

	.view-all-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.75rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.view-all-link:hover {
		background: var(--color-primary-hover, #2563eb);
	}

	.features h2 {
		margin: 0 0 2rem;
		font-size: 2rem;
		font-weight: 700;
		text-align: center;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.feature-card {
		padding: 2rem;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 12px;
		transition: box-shadow 0.2s;
	}

	.feature-card:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	.feature-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: 1rem;
		background: hsl(221.2 83.2% 53.3% / 0.1);
		border-radius: 8px;
		color: hsl(221.2 83.2% 53.3%);
	}

	.feature-card h3 {
		margin: 0 0 1rem;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.feature-card p {
		margin: 0 0 1.5rem;
		color: var(--color-muted, #64748b);
	}

	.feature-link {
		display: inline-block;
		color: var(--color-primary, #3b82f6);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.feature-link:hover {
		color: var(--color-primary-hover, #2563eb);
	}

	.technical-features {
		padding: 2rem;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 12px;
	}

	.technical-features h2 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.technical-features ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.technical-features li {
		margin-bottom: 0.75rem;
		color: var(--color-foreground, #1e293b);
	}

	.technical-features strong {
		color: var(--color-primary, #3b82f6);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.stats {
			flex-direction: column;
			width: 100%;
		}

		.stat-card {
			width: 100%;
		}

		.vendor-summary {
			max-width: 100%;
		}

		.vendor-item {
			flex-direction: column;
			align-items: flex-start;
		}

		.vendor-item-stats {
			width: 100%;
		}

		.vendor-subtotal {
			width: 100%;
			text-align: right;
		}
	}
</style>
