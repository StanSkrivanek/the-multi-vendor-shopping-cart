<!-- src/lib/wishlist/WishlistProvider.svelte -->
<script lang="ts">
	import { createWishlistContext } from './wishlist-context.svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		/** localStorage key for persistence (default: 'wishlist') */
		storageKey?: string

		/** Child content */
		children: Snippet
	}

	let { storageKey = 'wishlist', children }: Props = $props()

	createWishlistContext(storageKey)
</script>

{@render children()}