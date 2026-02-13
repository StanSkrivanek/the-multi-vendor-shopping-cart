// src/routes/api/coupons/validate/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Demo discount codes
 * In a real app, these would come from a database
 */
const DISCOUNT_CODES: Record<
	string,
	{
		type: 'percentage' | 'fixed';
		value: number;
		minOrder?: number;
		description: string;
	}
> = {
	SAVE10: {
		type: 'percentage',
		value: 10,
		description: '10% off your order'
	},
	SAVE20: {
		type: 'percentage',
		value: 20,
		minOrder: 5000, // $50 minimum
		description: '20% off orders over $50'
	},
	FLAT5: {
		type: 'fixed',
		value: 500, // $5 off
		description: '$5 off your order'
	},
	WELCOME: {
		type: 'percentage',
		value: 15,
		description: '15% off for new customers'
	},
	FREESHIP: {
		type: 'fixed',
		value: 599, // Covers standard shipping
		description: 'Free shipping ($5.99 value)'
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { code, subtotal } = await request.json();

		if (!code || typeof code !== 'string') {
			return json({ message: 'Please enter a discount code' }, { status: 400 });
		}

		const normalizedCode = code.trim().toUpperCase();
		const discount = DISCOUNT_CODES[normalizedCode];

		if (!discount) {
			return json(
				{ message: 'Invalid discount code. Try: SAVE10, SAVE20, FLAT5, WELCOME, or FREESHIP' },
				{ status: 400 }
			);
		}

		// Check minimum order requirement
		if (discount.minOrder && subtotal < discount.minOrder) {
			const minOrderFormatted = (discount.minOrder / 100).toFixed(2);
			return json(
				{ message: `This code requires a minimum order of ${minOrderFormatted}` },
				{ status: 400 }
			);
		}

		// Calculate the applied amount
		let appliedAmount: number;
		if (discount.type === 'percentage') {
			appliedAmount = Math.round(subtotal * (discount.value / 100));
		} else {
			appliedAmount = Math.min(discount.value, subtotal);
		}

		return json({
			code: normalizedCode,
			type: discount.type,
			value: discount.value,
			appliedAmount,
			description: discount.description
		});
	} catch {
		return json({ message: 'Failed to validate discount code' }, { status: 500 });
	}
};
