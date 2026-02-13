<!-- src/routes/demo/marketplace/all-carts/+page.svelte -->
<script lang="ts">
	import { createVendorSummaries } from '$lib/cart/vendor-carts.svelte';
	import { onMount } from 'svelte';

	const allVendors = createVendorSummaries();

	onMount(() => {
		allVendors.refresh();
	});

	function formatPrice(cents: number, currency: string): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(cents / 100);
	}

	let grandTotalItems = $derived(allVendors.totalCartItems);
	let grandTotalWishlist = $derived(allVendors.totalWishlistItems);
</script>

<div class="all-carts-page">
	<h1>All Vendor Carts & Wishlists</h1>
	<p>Overview of your items across all vendors. Each vendor has independent checkout.</p>

	<!-- Summary Stats -->
	<div class="summary-stats">
		<div class="stat-card">
			<div class="stat-icon">🛒</div>
			<div class="stat-value">{grandTotalItems}</div>
			<div class="stat-label">Total Cart Items</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">💝</div>
			<div class="stat-value">{grandTotalWishlist}</div>
			<div class="stat-label">Wishlisted Items</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🏪</div>
			<div class="stat-value">{allVendors.vendorsWithItems.length}</div>
			<div class="stat-label">Active Vendors</div>
		</div>
	</div>

	<!-- Vendor Sections -->
	{#if allVendors.vendorsWithItems.length === 0}
		<div class="empty-state">
			<p>No items yet. Browse vendors and add items to your carts or wishlists.</p>
			<a href="/demo/marketplace">Browse Marketplace</a>
		</div>
	{:else}
		{#each allVendors.summaries as summary (summary.vendor.id)}
			{@const hasItems = summary.cart.itemCount > 0 || summary.wishlist.count > 0}

			{#if hasItems}
				<div class="vendor-section">
					<h2>{summary.vendor.name}</h2>

					{#if summary.cart.itemCount > 0}
						<div class="section-block">
							<h3>🛒 Cart ({summary.cart.totalQuantity} items)</h3>
							<div class="items-grid">
								{#each summary.cart.items as item (item.id)}
									<div class="item-card">
										<span class="item-name">{item.product.name}</span>
										<span class="item-qty">Qty: {item.quantity}</span>
										<span class="item-price">
											{formatPrice(item.lineTotal, summary.vendor.currency)}
										</span>
									</div>
								{/each}
							</div>
							<div class="section-footer">
								<span>Subtotal: {formatPrice(summary.cart.subtotal, summary.vendor.currency)}</span>
								<a href="/demo/marketplace/{summary.vendor.slug}/cart">Go to Cart →</a>
							</div>
						</div>
					{/if}

					{#if summary.wishlist.count > 0}
						<div class="section-block wishlist">
							<h3>💝 Wishlist ({summary.wishlist.count} items)</h3>
							<div class="items-grid">
								{#each summary.wishlist.items as item (item.product.id)}
									<div class="item-card">
										<span class="item-name">{item.product.name}</span>
										<span class="item-price">
											{formatPrice(item.product.price, summary.vendor.currency)}
										</span>
									</div>
								{/each}
							</div>
							<a href="/demo/marketplace/{summary.vendor.slug}/wishlist">Go to Wishlist →</a>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	{/if}

	<!-- Note about separate checkouts -->
	<div class="info-banner">
		<strong>Note:</strong> Each vendor has independent checkout, shipping, and payment processing. This
		is common in marketplace apps like food delivery services where you can't combine orders from different
		restaurants.
	</div>
</div>

<style>
	.all-carts-page {
		padding: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.summary-stats {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		flex: 1;
		background: #f9f9f9;
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.stat-icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.stat-label {
		font-size: 0.9rem;
		color: #666;
	}

	.vendor-section {
		margin-bottom: 3rem;
	}

	h2 {
		border-bottom: 2px solid #eee;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}

	.section-block {
		background: #fff;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.items-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.item-card {
		background: #f9f9f9;
		border-radius: 8px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.item-name {
		font-weight: 500;
	}

	.item-qty {
		font-size: 0.9rem;
		color: #666;
	}

	.item-price {
		font-weight: bold;
		color: #333;
	}

	.section-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.section-footer a {
		background: #0070f3;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
	}

	.section-block.wishlist {
		background: #fff0f6;
	}

	.info-banner {
		background: #fffbe6;
		border: 1px solid #ffe58f;
		padding: 1rem;
		border-radius: 8px;
		margin-top: 2rem;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		background: #f0f0f0;
		border-radius: 8px;
	}

	.empty-state a {
		display: inline-block;
		margin-top: 1rem;
		background: #0070f3;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
	}
</style>
