<!-- src/lib/components/VendorHeader.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CartIcon from '$lib/cart/CartIcon.svelte';
	import { ROUTES } from '$lib/config/routes';
	import type { Vendor } from '$lib/data/products';
	import WishlistIcon from '$lib/wishlist/WishlistIcon.svelte';

	interface Props {
		vendor: Vendor;
	}

	let { vendor }: Props = $props();
</script>

<header class="vendor-header">
	<div class="header-content">
		<div class="header-left">
			<a href={ROUTES.MARKETPLACE} class="back-link">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Marketplace
			</a>
			<span class="divider">/</span>
			<span class="vendor-name">{vendor.name}</span>
		</div>

		<nav class="header-nav">
			<a href={ROUTES.vendor(vendor.slug)} class="nav-link">Products</a>
			<a href={ROUTES.vendorCart(vendor.slug)} class="nav-link">Cart</a>
			<a href={ROUTES.vendorWishlist(vendor.slug)} class="nav-link">Wishlist</a>
		</nav>

		<div class="header-actions">
			<WishlistIcon onclick={() => goto(ROUTES.vendorWishlist(vendor.slug))} />
			<CartIcon onclick={() => goto(ROUTES.vendorCart(vendor.slug))} />
		</div>
	</div>
</header>

<style>
	.vendor-header {
		background: white;
		border-bottom: 1px solid var(--color-border, #e2e8f0);
		position: sticky;
		top: 0;
		z-index: 30;
	}

	.header-content {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--color-muted, #64748b);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--color-primary, #3b82f6);
	}

	.back-link svg {
		width: 16px;
		height: 16px;
	}

	.divider {
		color: var(--color-border, #e2e8f0);
	}

	.vendor-name {
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
	}

	.header-nav {
		display: flex;
		gap: 1.5rem;
	}

	.nav-link {
		color: var(--color-muted, #64748b);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9375rem;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: var(--color-foreground, #1e293b);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	@media (max-width: 640px) {
		.header-nav {
			display: none;
		}
	}
</style>
