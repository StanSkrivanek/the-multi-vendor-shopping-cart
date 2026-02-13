<!-- src/routes/marketplace/[vendor]/+layout.svelte -->
<!-- src/routes/demo/marketplace/[vendor]/+layout.svelte -->
<script lang="ts">
	import CartProvider from '$lib/cart/CartProvider.svelte'
	import WishlistProvider from '$lib/wishlist/WishlistProvider.svelte'
	import VendorHeader from '$lib/components/VendorHeader.svelte'
	import type { LayoutData } from './$types'

	let { data, children }: { data: LayoutData; children: any } = $props()
</script>

<!-- Vendor-specific cart AND wishlist (nested, overrides parent contexts) -->
<CartProvider
	storageKey="{data.vendor.id}-cart"
	currency={data.vendor.currency}
	taxRate={data.vendor.taxRate}
	shippingCost={data.vendor.shippingCost}
>
	<WishlistProvider storageKey="{data.vendor.id}-wishlist">
		<VendorHeader vendor={data.vendor} />
		
		<div class="vendor-layout">
			<div class="vendor-info-banner">
				<span class="vendor-badge">{data.vendor.currency}</span>
				<span class="vendor-detail">Tax: {(data.vendor.taxRate * 100).toFixed(1)}%</span>
				<span class="vendor-detail">
					Shipping: {data.vendor.currency === 'USD' ? '$' : data.vendor.currency === 'GBP' ? '£' : '€'}{(data.vendor.shippingCost / 100).toFixed(2)}
				</span>
			</div>

			{@render children()}
		</div>
	</WishlistProvider>
</CartProvider>

<style>
	.vendor-layout {
		max-width: 1280px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.vendor-info-banner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface, #f8fafc);
		border: 1px solid var(--color-border, #e2e8f0);
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	.vendor-badge {
		padding: 0.25rem 0.5rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		border-radius: 4px;
		font-weight: 600;
		font-size: 0.75rem;
	}

	.vendor-detail {
		color: var(--color-muted, #64748b);
	}
</style>

