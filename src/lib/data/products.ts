// src/lib/data/products.ts

export interface Vendor {
	id: string;
	name: string;
	slug: string;
	description: string;
	logo?: string;
	location?: string;
	currency: string;
	taxRate: number;
	shippingCost: number;
}

export interface Product {
	id: string;
	vendorId: string;
	name: string;
	description: string;
	price: number; // in cents
	image: string;
	category: string;
	sku: string;
	maxQuantity: number;
	inStock: boolean;
	tags: string[];
}

// ─────────────────────────────────────────────────────────────
// Vendor Data
// ─────────────────────────────────────────────────────────────

export const vendors: Vendor[] = [
	{
		id: 'vendor-1',
		name: 'TechGear Pro',
		slug: 'techgear-pro',
		description: 'Premium electronics and gadgets for tech enthusiasts',
		logo: 'headphones',
		location: 'San Francisco, CA',
		currency: 'USD',
		taxRate: 0.0875,
		shippingCost: 799
	},
	{
		id: 'vendor-2',
		name: 'Artisan Crafts Co',
		slug: 'artisan-crafts',
		description: 'Handmade artisanal products with care and quality',
		logo: 'palette',
		location: 'Portland, OR',
		currency: 'USD',
		taxRate: 0.08,
		shippingCost: 599
	},
	{
		id: 'vendor-3',
		name: 'FitLife Essentials',
		slug: 'fitlife-essentials',
		description: 'Health, fitness, and wellness products for active lifestyles',
		logo: 'zap',
		location: 'Austin, TX',
		currency: 'USD',
		taxRate: 0.0825,
		shippingCost: 499
	},
	{
		id: 'vendor-4',
		name: 'HomeStyle Living',
		slug: 'homestyle-living',
		description: 'Modern home decor and lifestyle accessories',
		logo: 'home',
		location: 'Seattle, WA',
		currency: 'USD',
		taxRate: 0.101,
		shippingCost: 699
	}
];

// ─────────────────────────────────────────────────────────────
// Product Data (3 products per vendor = 12 total)
// ─────────────────────────────────────────────────────────────

export const products: Product[] = [
	// TechGear Pro Products
	{
		id: 'prod-1',
		vendorId: 'vendor-1',
		name: 'Wireless Noise-Canceling Headphones',
		description:
			'Premium over-ear headphones with active noise cancellation and 30-hour battery life',
		price: 29999, // $299.99
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
		category: 'Audio',
		sku: 'TGP-WH-001',
		maxQuantity: 10,
		inStock: true,
		tags: ['electronics', 'audio', 'wireless', 'premium']
	},
	{
		id: 'prod-2',
		vendorId: 'vendor-1',
		name: 'Smart Watch Pro',
		description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
		price: 39999, // $399.99
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
		category: 'Wearables',
		sku: 'TGP-SW-002',
		maxQuantity: 15,
		inStock: true,
		tags: ['electronics', 'wearables', 'fitness', 'smart']
	},
	{
		id: 'prod-3',
		vendorId: 'vendor-1',
		name: 'Portable Bluetooth Speaker',
		description: 'Waterproof speaker with 360-degree sound and 12-hour playtime',
		price: 7999, // $79.99
		image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
		category: 'Audio',
		sku: 'TGP-SP-003',
		maxQuantity: 20,
		inStock: true,
		tags: ['electronics', 'audio', 'portable', 'waterproof']
	},

	// Artisan Crafts Co Products
	{
		id: 'prod-4',
		vendorId: 'vendor-2',
		name: 'Handwoven Ceramic Mug Set',
		description: 'Set of 4 artisan-crafted ceramic mugs with unique glaze patterns',
		price: 5999, // $59.99
		image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
		category: 'Kitchenware',
		sku: 'ACC-MUG-004',
		maxQuantity: 8,
		inStock: true,
		tags: ['handmade', 'ceramic', 'kitchenware', 'artisan']
	},
	{
		id: 'prod-5',
		vendorId: 'vendor-2',
		name: 'Macrame Wall Hanging',
		description: 'Bohemian-style macrame wall art, handcrafted with natural cotton',
		price: 8999, // $89.99
		image: 'https://images.unsplash.com/photo-1595815771614-fbd07c51b4fb?w=500&q=80',
		category: 'Home Decor',
		sku: 'ACC-MAC-005',
		maxQuantity: 5,
		inStock: true,
		tags: ['handmade', 'decor', 'bohemian', 'wall-art']
	},
	{
		id: 'prod-6',
		vendorId: 'vendor-2',
		name: 'Leather Journal with Brass Clasp',
		description: 'Genuine leather-bound journal with hand-stitched binding and brass closure',
		price: 4999, // $49.99
		image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80',
		category: 'Stationery',
		sku: 'ACC-JRN-006',
		maxQuantity: 12,
		inStock: true,
		tags: ['handmade', 'leather', 'journal', 'stationery']
	},

	// FitLife Essentials Products
	{
		id: 'prod-7',
		vendorId: 'vendor-3',
		name: 'Premium Yoga Mat',
		description: 'Eco-friendly TPE yoga mat with alignment marks and carrying strap',
		price: 6999, // $69.99
		image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
		category: 'Fitness',
		sku: 'FLE-YGA-007',
		maxQuantity: 25,
		inStock: true,
		tags: ['fitness', 'yoga', 'eco-friendly', 'exercise']
	},
	{
		id: 'prod-8',
		vendorId: 'vendor-3',
		name: 'Resistance Bands Set',
		description: 'Set of 5 resistance bands with different tension levels and door anchor',
		price: 2999, // $29.99
		image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80',
		category: 'Fitness',
		sku: 'FLE-RES-008',
		maxQuantity: 30,
		inStock: true,
		tags: ['fitness', 'resistance', 'exercise', 'portable']
	},
	{
		id: 'prod-9',
		vendorId: 'vendor-3',
		name: 'Stainless Steel Water Bottle',
		description: '32oz insulated water bottle keeps drinks cold for 24 hours',
		price: 3499, // $34.99
		image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
		category: 'Hydration',
		sku: 'FLE-BTL-009',
		maxQuantity: 40,
		inStock: true,
		tags: ['fitness', 'hydration', 'insulated', 'eco-friendly']
	},

	// HomeStyle Living Products
	{
		id: 'prod-10',
		vendorId: 'vendor-4',
		name: 'Scented Candle Collection',
		description: 'Set of 3 soy wax candles with essential oils in modern concrete vessels',
		price: 4499, // $44.99
		image: 'https://images.unsplash.com/photo-1602874801006-e24246df2bfd?w=500&q=80',
		category: 'Home Fragrance',
		sku: 'HSL-CND-010',
		maxQuantity: 18,
		inStock: true,
		tags: ['home', 'candles', 'fragrance', 'soy']
	},
	{
		id: 'prod-11',
		vendorId: 'vendor-4',
		name: 'Minimalist Table Lamp',
		description: 'Modern desk lamp with touch dimming and warm LED light',
		price: 7999, // $79.99
		image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
		category: 'Lighting',
		sku: 'HSL-LMP-011',
		maxQuantity: 10,
		inStock: true,
		tags: ['home', 'lighting', 'modern', 'minimalist']
	},
	{
		id: 'prod-12',
		vendorId: 'vendor-4',
		name: 'Throw Pillow Set',
		description: 'Set of 2 decorative throw pillows with geometric patterns',
		price: 5499, // $54.99
		image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&q=80',
		category: 'Textiles',
		sku: 'HSL-PIL-012',
		maxQuantity: 15,
		inStock: true,
		tags: ['home', 'textiles', 'decor', 'pillows']
	}
];

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

/**
 * Get a vendor by slug
 */
export function getVendor(slug: string): Vendor | undefined {
	return vendors.find((v) => v.slug === slug);
}

/**
 * Get all products for a specific vendor
 */
export function getProductsByVendor(vendorId: string): Product[] {
	return products.filter((p) => p.vendorId === vendorId);
}

/**
 * Get all products for a vendor by slug
 */
export function getProductsByVendorSlug(slug: string): Product[] {
	const vendor = getVendor(slug);
	if (!vendor) return [];
	return getProductsByVendor(vendor.id);
}

/**
 * Get a product by ID
 */
export function getProduct(id: string): Product | undefined {
	return products.find((p) => p.id === id);
}

/**
 * Get all vendors
 */
export function getAllVendors(): Vendor[] {
	return vendors;
}

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
	return products;
}
