<!-- src/lib/components/Header.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CartIcon from '$lib/cart/CartIcon.svelte';
	import { ROUTES } from '$lib/config/routes';
	import WishlistIcon from '$lib/wishlist/WishlistIcon.svelte';
	import { ShoppingBag } from 'lucide-svelte';
</script>

<header class="site-header">
	<div class="header-content">
		<a href={ROUTES.HOME} class="logo">
			<ShoppingBag size={24} />
			<span>Hackpile Store</span>
		</a>

		<nav class="main-nav">
			<a href={ROUTES.HOME}>Home</a>
			<a href={ROUTES.DEMO}>Demo</a>
			<!-- <a href={ROUTES.PRODUCTS}>Products</a>
			<a href={ROUTES.MARKETPLACE}>Marketplace</a> -->
		</nav>

		<div class="header-actions">
			<WishlistIcon onclick={() => goto(ROUTES.WISHLIST)} />
			<CartIcon onclick={() => goto(ROUTES.CART)} />
		</div>
	</div>
</header>

<style>
	.site-header {
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

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground, #1e293b);
		text-decoration: none;
		transition: color 0.2s;
	}

	.logo:hover {
		color: var(--color-primary, #3b82f6);
	}

	.main-nav {
		display: flex;
		gap: 2rem;
	}

	.main-nav a {
		color: var(--color-muted, #64748b);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.main-nav a:hover {
		color: var(--color-foreground, #1e293b);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	@media (max-width: 640px) {
		.main-nav {
			display: none;
		}
	}
</style>
