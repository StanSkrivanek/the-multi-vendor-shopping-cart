<!-- src/lib/wishlist/WishlistProvider.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createWishlistContext } from './wishlist-context.svelte';

	interface Props {
		/** localStorage key for persistence (default: 'wishlist') */
		storageKey?: string;

		/** Child content */
		children: Snippet;
	}

	let { storageKey = 'wishlist', children }: Props = $props();

	untrack(() => {
		createWishlistContext(storageKey);
	});
</script>

{@render children()}
