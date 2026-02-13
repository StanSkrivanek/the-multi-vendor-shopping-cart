<!-- src/lib/components/VendorLogo.svelte -->
<script lang="ts">
	import { Headphones, Home, Palette, ShoppingBag, Zap } from 'lucide-svelte';

	interface Props {
		icon: string;
		[key: string]: any;
	}

	let { icon, size = 24, strokeWidth = 2, ...rest }: Props = $props();

	// Map icon names to components
	const iconMap: Record<string, any> = {
		headphones: Headphones,
		palette: Palette,
		zap: Zap,
		home: Home,
		'shopping-bag': ShoppingBag
	};

	const IconComponent = $derived(iconMap[icon] || ShoppingBag);
</script>

<IconComponent {size} {strokeWidth} {...rest} />
