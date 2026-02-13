<!-- src/routes/demo/marketplace/+page.svelte -->
<script lang="ts">
	import { getAllVendors, getProductsByVendor } from '$lib/data/products';

	const vendors = getAllVendors();

	function getVendorProductCount(vendorId: string): number {
		return getProductsByVendor(vendorId).length;
	}
</script>

<svelte:head>
	<title>Marketplace - Hackpile Store</title>
</svelte:head>

<div class="marketplace-page">
	<div class="page-header">
		<h1>Marketplace</h1>
		<p>Shop from multiple independent vendors in one place</p>
	</div>

	<div class="vendors-grid">
		{#each vendors as vendor (vendor.id)}
			{@const productCount = getVendorProductCount(vendor.id)}

			<a href="/demo/marketplace/{vendor.slug}" class="vendor-card">
				<div class="vendor-logo">{vendor.logo}</div>

				<div class="vendor-info">
					<h2 class="vendor-name">{vendor.name}</h2>
					<p class="vendor-description">{vendor.description}</p>

					{#if vendor.location}
						<div class="vendor-meta">
							<span class="meta-icon">📍</span>
							<span>{vendor.location}</span>
						</div>
					{/if}

					<div class="vendor-stats">
						<span class="stat">
							<span class="stat-icon">📦</span>
							<span>{productCount} products</span>
						</span>
					</div>
				</div>

				<div class="vendor-action">
					<span class="browse-btn">Browse Store →</span>
				</div>
			</a>
		{/each}
	</div>

	<div class="info-section">
		<h3>How It Works</h3>
		<div class="info-grid">
			<div class="info-card">
				<div class="info-icon">🛒</div>
				<h4>Independent Carts</h4>
				<p>Each vendor has its own cart. Add items from multiple vendors at once.</p>
			</div>
			<div class="info-card">
				<div class="info-icon">💳</div>
				<h4>Separate Checkout</h4>
				<p>Complete checkout independently for each vendor when you're ready.</p>
			</div>
			<div class="info-card">
				<div class="info-icon">💝</div>
				<h4>Unified Wishlist</h4>
				<p>Save favorites from any vendor to your personal wishlist.</p>
			</div>
		</div>
	</div>
</div>

<style>
	.marketplace-page {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.page-header {
		margin-bottom: 3rem;
		text-align: center;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--color-foreground, #1e293b);
	}

	.page-header p {
		font-size: 1.125rem;
		color: var(--color-muted, #64748b);
	}

	.vendors-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.vendor-card {
		display: flex;
		flex-direction: column;
		background: white;
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 0.75rem;
		padding: 2rem;
		text-decoration: none;
		transition: all 0.2s;
	}

	.vendor-card:hover {
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
		border-color: var(--color-primary, #3b82f6);
	}

	.vendor-logo {
		font-size: 4rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.vendor-info {
		flex: 1;
	}

	.vendor-name {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
		margin-bottom: 0.75rem;
	}

	.vendor-description {
		font-size: 0.938rem;
		color: var(--color-muted, #64748b);
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.vendor-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-muted, #64748b);
		margin-bottom: 1rem;
	}

	.meta-icon {
		font-size: 1rem;
	}

	.vendor-stats {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-foreground, #1e293b);
	}

	.stat-icon {
		font-size: 1rem;
	}

	.vendor-action {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border, #e2e8f0);
	}

	.browse-btn {
		display: inline-flex;
		align-items: center;
		font-weight: 600;
		color: var(--color-primary, #3b82f6);
		transition: gap 0.2s;
	}

	.vendor-card:hover .browse-btn {
		gap: 0.5rem;
	}

	.info-section {
		margin-top: 4rem;
		padding-top: 3rem;
		border-top: 2px solid var(--color-border, #e2e8f0);
	}

	.info-section h3 {
		font-size: 1.75rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 2rem;
		color: var(--color-foreground, #1e293b);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.info-card {
		text-align: center;
		padding: 1.5rem;
	}

	.info-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.info-card h4 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-foreground, #1e293b);
		margin-bottom: 0.5rem;
	}

	.info-card p {
		font-size: 0.938rem;
		color: var(--color-muted, #64748b);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.vendors-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
