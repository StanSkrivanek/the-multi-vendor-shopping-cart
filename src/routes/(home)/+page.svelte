<script>
	import {
		BookOpen,
		Github,
		Heart,
		Package,
		Shield,
		ShoppingCart,
		Store,
		UtensilsCrossed,
		Zap
	} from 'lucide-svelte';
</script>

<div class="landing-page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="hero-content">
			<div class="badge">Built with Svelte 5</div>
			<h1 class="hero-title">
				Production-Ready<br />
				<span class="gradient-text">Shopping Cart System</span>
			</h1>
			<p class="hero-description">
				A comprehensive demonstration of advanced e-commerce features using Svelte 5's Context API.
				Multi-vendor support, real-time reactivity, and enterprise-grade state management.
			</p>
			<div class="hero-actions">
				<a href="/demo" class="btn btn-primary">
					<Zap size={20} />
					View Live Demo
				</a>
				<a href="https://github.com/yourusername/sv-cart" class="btn btn-secondary">
					<Github size={20} />
					View on GitHub
				</a>
			</div>
		</div>
	</section>

	<!-- Features Grid -->
	<section class="features">
		<h2 class="section-title">Key Features</h2>
		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon">
					<Store size={28} />
				</div>
				<h3>Multi-Vendor Architecture</h3>
				<p>
					Isolated cart contexts for each vendor. Perfect for marketplace platforms where multiple
					sellers need independent checkout flows.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Zap size={28} />
				</div>
				<h3>Real-Time Reactivity</h3>
				<p>
					Built with Svelte 5's <code>$state</code> and <code>$derived</code> runes for instant UI updates
					without manual subscription management.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Shield size={28} />
				</div>
				<h3>Type-Safe Operations</h3>
				<p>
					Full TypeScript support with Result types for explicit error handling. No runtime
					surprises, just predictable code.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Package size={28} />
				</div>
				<h3>Persistent Storage</h3>
				<p>
					Automatic localStorage synchronization using <code>$effect</code>. Cart state survives
					page refreshes and browser restarts.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<ShoppingCart size={28} />
				</div>
				<h3>Advanced Cart Features</h3>
				<p>
					Stock validation, quantity limits, discount codes, tax calculations, and free shipping
					thresholds all included.
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon">
					<Heart size={28} />
				</div>
				<h3>Wishlist Integration</h3>
				<p>
					Separate wishlist context working alongside carts. Demonstrates how multiple contexts
					coexist without conflicts.
				</p>
			</div>
		</div>
	</section>

	<!-- Use Cases -->
	<section class="use-cases">
		<h2 class="section-title">Perfect For</h2>
		<div class="use-cases-grid">
			<div class="use-case">
				<div class="use-case-icon">
					<Store size={24} />
				</div>
				<h3>Marketplace Platforms</h3>
				<p>Multi-vendor e-commerce sites like Etsy, where each seller needs independent carts</p>
			</div>
			<div class="use-case">
				<div class="use-case-icon">
					<UtensilsCrossed size={24} />
				</div>
				<h3>Food Delivery Apps</h3>
				<p>Restaurant ordering systems where users can't combine orders from different locations</p>
			</div>
			<div class="use-case">
				<div class="use-case-icon">
					<ShoppingCart size={24} />
				</div>
				<h3>Retail Websites</h3>
				<p>Traditional online stores with single cart and comprehensive checkout flows</p>
			</div>
			<div class="use-case">
				<div class="use-case-icon">
					<BookOpen size={24} />
				</div>
				<h3>Learning Projects</h3>
				<p>Educational resource for understanding Svelte 5's Context API and state management</p>
			</div>
		</div>
	</section>

	<!-- Tech Stack -->
	<section class="tech-stack">
		<h2 class="section-title">Built With Modern Tools</h2>
		<div class="tech-list">
			<div class="tech-item">
				<div class="tech-logo">
					<svg xmlns="http://www.w3.org/2000/svg" width="107" height="128" viewBox="0 0 107 128"
						><title>svelte-logo</title><path
							d="M94.1566,22.8189c-10.4-14.8851-30.94-19.2971-45.7914-9.8348L22.2825,29.6078A29.9234,29.9234,0,0,0,8.7639,49.6506a31.5136,31.5136,0,0,0,3.1076,20.2318A30.0061,30.0061,0,0,0,7.3953,81.0653a31.8886,31.8886,0,0,0,5.4473,24.1157c10.4022,14.8865,30.9423,19.2966,45.7914,9.8348L84.7167,98.3921A29.9177,29.9177,0,0,0,98.2353,78.3493,31.5263,31.5263,0,0,0,95.13,58.117a30,30,0,0,0,4.4743-11.1824,31.88,31.88,0,0,0-5.4473-24.1157"
							style="fill:#ff3e00"
						/><path
							d="M45.8171,106.5815A20.7182,20.7182,0,0,1,23.58,98.3389a19.1739,19.1739,0,0,1-3.2766-14.5025,18.1886,18.1886,0,0,1,.6233-2.4357l.4912-1.4978,1.3363.9815a33.6443,33.6443,0,0,0,10.203,5.0978l.9694.2941-.0893.9675a5.8474,5.8474,0,0,0,1.052,3.8781,6.2389,6.2389,0,0,0,6.6952,2.485,5.7449,5.7449,0,0,0,1.6021-.7041L69.27,76.281a5.4306,5.4306,0,0,0,2.4506-3.631,5.7948,5.7948,0,0,0-.9875-4.3712,6.2436,6.2436,0,0,0-6.6978-2.4864,5.7427,5.7427,0,0,0-1.6.7036l-9.9532,6.3449a19.0329,19.0329,0,0,1-5.2965,2.3259,20.7181,20.7181,0,0,1-22.2368-8.2427,19.1725,19.1725,0,0,1-3.2766-14.5024,17.9885,17.9885,0,0,1,8.13-12.0513L55.8833,23.7472a19.0038,19.0038,0,0,1,5.3-2.3287A20.7182,20.7182,0,0,1,83.42,29.6611a19.1739,19.1739,0,0,1,3.2766,14.5025,18.4,18.4,0,0,1-.6233,2.4357l-.4912,1.4978-1.3356-.98a33.6175,33.6175,0,0,0-10.2037-5.1l-.9694-.2942.0893-.9675a5.8588,5.8588,0,0,0-1.052-3.878,6.2389,6.2389,0,0,0-6.6952-2.485,5.7449,5.7449,0,0,0-1.6021.7041L37.73,51.719a5.4218,5.4218,0,0,0-2.4487,3.63,5.7862,5.7862,0,0,0,.9856,4.3717,6.2437,6.2437,0,0,0,6.6978,2.4864,5.7652,5.7652,0,0,0,1.602-.7041l9.9519-6.3425a18.978,18.978,0,0,1,5.2959-2.3278,20.7181,20.7181,0,0,1,22.2368,8.2427,19.1725,19.1725,0,0,1,3.2766,14.5024,17.9977,17.9977,0,0,1-8.13,12.0532L51.1167,104.2528a19.0038,19.0038,0,0,1-5.3,2.3287"
							style="fill:#fff"
						/></svg
					>
				</div>
				<div class="tech-name">Svelte 5</div>
			</div>
			<div class="tech-item">
				<div class="tech-logo">
					<svg
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 400 400"
						width="2500"
						height="2500"
						><style>
							.st0 {
								fill: #007acc;
							}
							.st1 {
								fill: #fff;
							}
						</style><path class="st0" d="M0 200V0h400v400H0" /><path
							class="st1"
							d="M87.7 200.7V217h52v148h36.9V217h52v-16c0-9 0-16.3-.4-16.5 0-.3-31.7-.4-70.2-.4l-70 .3v16.4l-.3-.1zM321.4 184c10.2 2.4 18 7 25 14.3 3.7 4 9.2 11 9.6 12.8 0 .6-17.3 12.3-27.8 18.8-.4.3-2-1.4-3.6-4-5.2-7.4-10.5-10.6-18.8-11.2-12-.8-20 5.5-20 16 0 3.2.6 5 1.8 7.6 2.7 5.5 7.7 8.8 23.2 15.6 28.6 12.3 41 20.4 48.5 32 8.5 13 10.4 33.4 4.7 48.7-6.4 16.7-22 28-44.3 31.7-7 1.2-23 1-30.5-.3-16-3-31.3-11-40.7-21.3-3.7-4-10.8-14.7-10.4-15.4l3.8-2.4 15-8.7 11.3-6.6 2.6 3.5c3.3 5.2 10.7 12.2 15 14.6 13 6.7 30.4 5.8 39-2 3.7-3.4 5.3-7 5.3-12 0-4.6-.7-6.7-3-10.2-3.2-4.4-9.6-8-27.6-16-20.7-8.8-29.5-14.4-37.7-23-4.7-5.2-9-13.3-11-20-1.5-5.8-2-20-.6-25.7 4.3-20 19.4-34 41-38 7-1.4 23.5-.8 30.4 1l-.2.2z"
						/></svg
					>
				</div>
				<div class="tech-name">TypeScript</div>
			</div>
			<div class="tech-item">
				<div class="tech-logo">
					<svg viewBox="0 0 410 404" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8904 208.776 77.6763L389.119 44.8058C397.439 43.2894 403.768 52.1434 399.641 59.5246Z"
							fill="url(#paint0_linear)"
						/>
						<path
							d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 173.055 194.443 176.622L183.18 231.775C182.422 235.487 185.907 238.661 189.532 237.56L212.947 230.446C216.577 229.344 220.065 232.527 219.297 236.242L201.398 322.875C200.278 328.294 207.486 331.249 210.492 326.603L212.5 323.5L323.454 102.072C325.312 98.3645 322.108 94.137 318.036 94.9228L279.014 102.454C275.347 103.161 272.227 99.746 273.262 96.1583L298.731 7.86689C299.767 4.27314 296.636 0.855181 292.965 1.5744Z"
							fill="url(#paint1_linear)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear"
								x1="6.00017"
								y1="32.9999"
								x2="235"
								y2="344"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#41D1FF" />
								<stop offset="1" stop-color="#BD34FE" />
							</linearGradient>
							<linearGradient
								id="paint1_linear"
								x1="194.651"
								y1="8.81818"
								x2="236.076"
								y2="292.989"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#FFEA83" />
								<stop offset="0.0833333" stop-color="#FFDD35" />
								<stop offset="1" stop-color="#FFA800" />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<div class="tech-name">Vite</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta">
		<h2>Ready to Explore?</h2>
		<p>Dive into the interactive demo and see these features in action</p>
		<a href="/demo" class="btn btn-large">
			<ShoppingCart size={24} />
			Launch Demo
		</a>
	</section>
</div>

<style>
	.landing-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
	}

	/* Hero Section */
	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 90vh;
		padding: 4rem 2rem;
		text-align: center;
		/* background: radial-gradient(circle at 50% 0%, rgba(246, 96, 59, 0.1) 0%, transparent 50%); */
	}

	.hero-content {
		max-width: 800px;
	}

	.badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: hsl(4.8 85.3% 61.8% / 0.1);
		color: hsl(4.8 85.3% 61.8%);
		border-radius: 100px;
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 2rem;
		border: 1px solid hsl(4.8 85.3% 61.8% / 0.2);
	}

	.hero-title {
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		font-weight: 900;
		line-height: 1.1;
		margin: 0 0 1.5rem;
		color: #0f172a;
	}

	.gradient-text {
		background: linear-gradient(135deg, #f66e5c 50%, #ec2424 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: 1.25rem;
		line-height: 1.7;
		color: #475569;
		margin: 0 0 3rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.2s;
		cursor: pointer;
		border: 2px solid transparent;
	}

	.btn-primary {
		background: linear-gradient(135deg, #f66e5c 50%, #ec2424 100%);
		color: white;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
	}

	.btn-secondary {
		background: white;
		color: #1e293b;
		border-color: #e2e8f0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.btn-secondary:hover {
		border-color: #cbd5e1;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.btn-large {
		padding: 1.25rem 2.5rem;
		font-size: 1.125rem;
	}

	/* Sections */
	section {
		padding: 5rem 2rem;
		max-width: 1280px;
		margin: 0 auto;
	}

	.section-title {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		text-align: center;
		margin: 0 0 3rem;
		color: #0f172a;
	}

	/* Features Grid */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: white;
		padding: 2rem;
		border-radius: 16px;
		border: 1px solid #e2e8f0;
		transition: all 0.3s;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
		border-color: #3b82f6;
	}

	.feature-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #f66e5c 50%, #ec2424 100%);
		color: white;
		border-radius: 12px;
		margin-bottom: 1.5rem;
	}

	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 1rem;
		color: #0f172a;
	}

	.feature-card p {
		color: #64748b;
		line-height: 1.7;
		margin: 0;
	}

	.feature-card code {
		background: #f1f5f9;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #3b82f6;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	/* Use Cases */
	.use-cases {
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-radius: 24px;
		padding: 4rem 2rem;
	}

	.use-cases-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.use-case {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		border: 1px solid #e2e8f0;
	}

	.use-case-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: hsla(18, 83%, 53%, 0.1);
		color: hsl(5, 83%, 53%);
		border-radius: 10px;
		margin-bottom: 1rem;
	}

	.use-case h3 {
		font-size: 1.125rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: #0f172a;
	}

	.use-case p {
		color: #64748b;
		line-height: 1.6;
		margin: 0;
	}

	/* Tech Stack */
	.tech-list {
		display: flex;
		justify-content: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	.tech-item {
		text-align: center;
	}

	.tech-logo {
		width: 80px;
		height: 80px;
		margin: 0 auto 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tech-logo svg {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.tech-name {
		font-weight: 600;
		color: #475569;
		font-size: 1.125rem;
	}

	/* CTA Section */
	.cta {
		text-align: center;
		background: linear-gradient(180deg, #f66e5c 50%, #ec2424 100%);
		color: white;
		border-radius: 24px;
		padding: 5rem 2rem;
	}

	.cta h2 {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		margin: 0 0 1rem;
	}

	.cta p {
		font-size: 1.25rem;
		opacity: 0.95;
		margin: 0 0 2.5rem;
	}

	.cta .btn {
		background: white;
		color: #3b82f6;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.cta .btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.hero {
			min-height: 80vh;
			padding: 3rem 1.5rem;
		}

		section {
			padding: 3rem 1.5rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.btn {
			justify-content: center;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.tech-list {
			gap: 2rem;
		}
	}
</style>
