// src/routes/marketplace/[vendor]/+layout.server.ts

import { error } from '@sveltejs/kit';
import { getVendor } from '$lib/data/products';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	const vendor = getVendor(params.vendor);

	if (!vendor) {
		throw error(404, `Vendor "${params.vendor}" not found`);
	}

	return {
		vendor
	};
};
