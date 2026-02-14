<h1>Welcome to Context API DEMO</h1>

<div class="demo-overview">
	<div class="demo-section">
		<h2>Multi-Vendor Marketplace</h2>
		<p>
			Experience the power of scoped cart contexts with multi-vendor marketplace demo. Each
			vendor has its own isolated cart, allowing clients to shop across multiple stores without any
			interference. View cart summary for each vendor and see how the cart state is maintained
			separately.
		</p>
	</div>

	<div class="demo-section">
		<h2>Product Catalog</h2>
		<p>
			Browse product catalog and add items to cart. Each product belongs to a specific
			vendor, and when you add it to your cart, it will be added to that vendor's cart context. This
			allows client to manage multiple carts seamlessly as you shop across different vendors.
		</p>
	</div>

	<div class="demo-section">
		<h2>Vendor Marketplace</h2>
		<p>
			THe vendor marketplace is where client can see all the active vendors and their cart
			summaries. Click on any vendor to view their specific cart details and manage cart items. This
			demonstrates how each vendor's cart context is isolated, ensuring a smooth shopping experience
			across multiple stores.
		</p>

	</div>
</div>

<div class="demo-overview">
	<div class="demo-section">
		<h2>Vendor Marketplace Summary</h2>
		<p>
			Get a quick overview of all active vendors in the marketplace along with their cart and
			wishlist summaries. This section highlights how the cart state is maintained separately for
			each vendor, allowing you to easily manage your shopping experience across multiple stores.
		</p>
	</div>

	<div class="demo-section">
		<h2>Vendor Carts/Wishlists Summary</h2>
		<p>
			See a summary of all vendors with items in their carts or wishlists. This section demonstrates
			how you can easily track your shopping activity across different vendors, with clear
			indicators of the number of items in each cart and wishlist.
		</p>
	</div>
</div>

<style>
.demo-overview {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
}
.demo-section {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 8px;
}
.demo-section h2 {
    margin-top: 0;
}
.demo-section p {
    margin-bottom: 0;
}   
</style>