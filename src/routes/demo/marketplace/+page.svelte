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

<div class="marketplace">
	<div class="marketplace-header">
		<div class="badge">Multi-Vendor Platform</div>
		<h1>Marketplace</h1>
		<p class="subtitle">
			Explore our vendor ecosystem. Each vendor maintains their own isolated cart with custom
			pricing, shipping, and tax rates.
		</p>
	</div>

	<div class="features">
		<div class="feature">
			<div class="feature-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path
						d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"
					/><circle cx="12" cy="14" r="2" /></svg
				>
			</div>
			<div class="feature-content">
				<h3>Isolated Carts</h3>
				<p>Each vendor has their own shopping cart with separate checkout flows</p>
			</div>
		</div>
		<div class="feature">
			<div class="feature-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><circle cx="12" cy="12" r="10" /><path
						d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"
					/><path d="M2 12h20" /></svg
				>
			</div>
			<div class="feature-content">
				<h3>Custom Rules</h3>
				<p>Independent tax rates, currencies, shipping policies, and discounts</p>
			</div>
		</div>
		<div class="feature">
			<div class="feature-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
						cx="12"
						cy="7"
						r="4"
					/></svg
				>
			</div>
			<div class="feature-content">
				<h3>Persistent State</h3>
				<p>Vendor-specific storage keys maintain state across sessions</p>
			</div>
		</div>
	</div>

	<div class="vendors-section">
		<h2>Our Vendors</h2>
		<div class="vendors-grid">
			{#each vendors as vendor (vendor.id)}
				{@const productCount = getVendorProductCount(vendor.id)}

				<a href="/demo/marketplace/{vendor.slug}" class="vendor-card">
					<div class="vendor-header">
						<div class="vendor-logo">{vendor.logo}</div>
						<div class="vendor-badge">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><polyline points="9 11 12 14 22 4" /><path
									d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
								/></svg
							>
							Verified
						</div>
					</div>

					<div class="vendor-info">
						<h3>{vendor.name}</h3>
						<p class="vendor-description">{vendor.description}</p>

						<div class="vendor-meta">
							{#if vendor.location}
								<span class="meta-item">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
											cx="12"
											cy="10"
											r="3"
										/></svg
									>
									{vendor.location}
								</span>
							{/if}
							<span class="meta-item">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
										cx="12"
										cy="7"
										r="4"
									/></svg
								>
								{productCount} products
							</span>
						</div>
					</div>

					<div class="vendor-action">
						<span>View Store</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
						>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<div class="technical-note">
		<h3>Technical Implementation</h3>
		<p>
			This marketplace demonstrates <strong>scoped context isolation</strong> using Svelte 5's
			Context API. Each vendor page wraps its content in a nested
			<code>CartProvider</code> with vendor-specific configuration:
		</p>
		<pre><code
				>&lt;CartProvider
  storageKey="cart-{'{vendor-id}'}"
  taxRate={'{vendor.taxRate}'}
  currency={'{vendor.currency}'}
  freeShippingThreshold={'{vendor.threshold}'}
&gt;
  &lt;!-- Vendor products --&gt;
&lt;/CartProvider&gt;</code
			></pre>
		<p>
			This pattern is perfect for multi-tenant SaaS applications, e-commerce platforms with multiple
			sellers, or any scenario requiring isolated state management.
		</p>
	</div>

	<div class="demo-links">
		<a href="/demo" class="back-link">← Back to Demo Home</a>
		<a href="/demo/products" class="products-link">Browse Main Store →</a>
	</div>
</div>

<!-- <style>
	.marketplace-page {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.marketplace-header {
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
</style> -->

<style>
	.marketplace {
		max-width: 1280px;
		margin: 0 auto;
		padding: 4rem 1.5rem 6rem;
		min-height: 100vh;
	}

	.marketplace-header {
		text-align: center;
		margin-bottom: 5rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.875rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: hsl(222.2 47.4% 11.2%);
		background: hsl(210 40% 96.1%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-radius: 9999px;
		transition: all 0.2s;
	}

	.marketplace-header h1 {
		margin: 0 0 1rem;
		font-size: 3.5rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: hsl(222.2 84% 4.9%);
		line-height: 1.1;
	}

	.subtitle {
		margin: 0 auto;
		max-width: 700px;
		font-size: 1.125rem;
		color: hsl(215.4 16.3% 46.9%);
		line-height: 1.7;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 5rem;
	}

	.feature {
		display: flex;
		gap: 1rem;
		padding: 1.5rem;
		background: hsl(0 0% 100%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-radius: 0.75rem;
		transition: all 0.2s;
	}

	.feature:hover {
		border-color: hsl(215.4 16.3% 86.9%);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.feature-icon {
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: hsl(210 40% 96.1%);
		border-radius: 0.5rem;
		color: hsl(221.2 83.2% 53.3%);
	}

	.feature-content h3 {
		margin: 0 0 0.375rem;
		font-size: 1rem;
		font-weight: 600;
		color: hsl(222.2 84% 4.9%);
	}

	.feature-content p {
		margin: 0;
		font-size: 0.875rem;
		color: hsl(215.4 16.3% 46.9%);
		line-height: 1.5;
	}

	.vendors-section {
		margin-bottom: 4rem;
	}

	.vendors-section h2 {
		margin: 0 0 2rem;
		font-size: 2rem;
		font-weight: 700;
		color: hsl(222.2 84% 4.9%);
		letter-spacing: -0.02em;
	}

	.vendors-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
		gap: 1.5rem;
	}

	.vendor-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background: hsl(0 0% 100%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-radius: 0.75rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
		overflow: hidden;
	}

	.vendor-card:hover {
		border-color: hsl(221.2 83.2% 53.3%);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.vendor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.vendor-logo {
		font-size: 3rem;
		line-height: 1;
	}

	.vendor-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: hsl(142.1 76.2% 36.3%);
		background: hsl(142.1 76.2% 96%);
		border-radius: 9999px;
	}

	.vendor-badge svg {
		width: 12px;
		height: 12px;
	}

	.vendor-info {
		flex: 1;
		margin-bottom: 1rem;
	}

	.vendor-info h3 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: hsl(222.2 84% 4.9%);
		letter-spacing: -0.01em;
	}

	.vendor-description {
		margin: 0 0 1rem;
		font-size: 0.938rem;
		color: hsl(215.4 16.3% 46.9%);
		line-height: 1.6;
	}

	.vendor-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		color: hsl(215.4 16.3% 46.9%);
	}

	.meta-item svg {
		color: hsl(215.4 16.3% 56.9%);
	}

	.vendor-action {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: hsl(221.2 83.2% 53.3%);
		background: hsl(210 40% 96.1%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-radius: 0.5rem;
		align-self: flex-start;
		transition: all 0.2s;
	}

	.vendor-card:hover .vendor-action {
		background: hsl(221.2 83.2% 53.3%);
		color: hsl(0 0% 100%);
		border-color: hsl(221.2 83.2% 53.3%);
	}

	.vendor-action svg {
		width: 16px;
		height: 16px;
		transition: transform 0.2s;
	}

	.vendor-card:hover .vendor-action svg {
		transform: translateX(2px);
	}

	.technical-note {
		padding: 1.5rem;
		background: hsl(0 0% 100%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-left: 3px solid hsl(221.2 83.2% 53.3%);
		border-radius: 0.75rem;
		margin-bottom: 3rem;
	}

	.technical-note h3 {
		margin: 0 0 1rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: hsl(222.2 84% 4.9%);
	}

	.technical-note p {
		margin: 0 0 1rem;
		font-size: 0.938rem;
		color: hsl(215.4 16.3% 46.9%);
		line-height: 1.7;
	}

	.technical-note p:last-of-type {
		margin-bottom: 0;
	}

	.technical-note code {
		padding: 0.125rem 0.375rem;
		font-size: 0.875rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Courier New', monospace;
		background: hsl(210 40% 96.1%);
		border: 1px solid hsl(214.3 31.8% 91.4%);
		border-radius: 0.375rem;
		color: hsl(222.2 84% 4.9%);
	}

	.technical-note pre {
		margin: 1rem 0;
		padding: 1rem;
		background: hsl(222.2 84% 4.9%);
		border-radius: 0.5rem;
		overflow-x: auto;
	}

	.technical-note pre code {
		background: none;
		padding: 0;
		border: none;
		display: block;
		color: hsl(210 40% 96.1%);
		font-size: 0.8125rem;
		line-height: 1.6;
	}

	.demo-links {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 2rem;
		border-top: 1px solid hsl(214.3 31.8% 91.4%);
	}

	.demo-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.938rem;
		font-weight: 500;
		color: hsl(221.2 83.2% 53.3%);
		text-decoration: none;
		transition: color 0.2s;
	}

	.demo-links a:hover {
		color: hsl(221.2 83.2% 43.3%);
	}

	@media (max-width: 1024px) {
		.vendors-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.marketplace {
			padding: 2rem 1rem 4rem;
		}

		.marketplace-header h1 {
			font-size: 2.5rem;
		}

		.features {
			grid-template-columns: 1fr;
		}

		.demo-links {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}
	}
</style>
