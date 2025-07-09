"use client";

import {
	ArrowRight,
	Check,
	Database,
	Menu,
	Search,
	Sparkles,
	Star,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/count-up";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

export default function Page() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<div className="fixed top-0 w-full z-50 px-6 lg:px-8 py-4">
				<nav
					className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
						scrolled
							? "bg-background/70 backdrop-blur-lg border shadow-lg"
							: "bg-background/50 backdrop-blur-lg border"
					}`}
				>
					<div className="px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
									<Sparkles className="h-5 w-5 text-white" />
								</div>
								<span className="text-xl font-bold">Rinda Internal</span>
							</div>
							<div className="hidden md:flex items-center gap-4">
								<Button asChild variant="ghost" size="sm">
									<Link href="#features">Features</Link>
								</Button>
								<Button asChild variant="ghost" size="sm">
									<Link href="#how-it-works">How it Works</Link>
								</Button>
								<Button asChild variant="ghost" size="sm">
									<Link href="#testimonials">Testimonials</Link>
								</Button>
								<Button asChild variant="ghost" size="sm">
									<Link href="/auth">Sign In</Link>
								</Button>
								<Button asChild size="sm">
									<Link href="/auth">Get Started</Link>
								</Button>
							</div>
							<div className="md:hidden">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								>
									{mobileMenuOpen ? (
										<X className="h-5 w-5" />
									) : (
										<Menu className="h-5 w-5" />
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Mobile menu */}
					{mobileMenuOpen && (
						<div className="md:hidden bg-background/70 backdrop-blur-lg border-t rounded-b-2xl">
							<div className="px-6 py-4 space-y-2">
								<Link
									href="#features"
									className="block py-2 text-sm font-medium hover:text-primary"
								>
									Features
								</Link>
								<Link
									href="#how-it-works"
									className="block py-2 text-sm font-medium hover:text-primary"
								>
									How it Works
								</Link>
								<Link
									href="#testimonials"
									className="block py-2 text-sm font-medium hover:text-primary"
								>
									Testimonials
								</Link>
								<Link
									href="/auth"
									className="block py-2 text-sm font-medium hover:text-primary"
								>
									Sign In
								</Link>
								<Button asChild size="sm" className="w-full mt-2">
									<Link href="/auth">Get Started</Link>
								</Button>
							</div>
						</div>
					)}
				</nav>
			</div>

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-24">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/5 to-background" />

				{/* Decorative elements */}
				<div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-t from-primary/10 to-transparent shadow-xl shadow-primary/10 ring-1 ring-primary/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

				<div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
					<div className="mx-auto max-w-2xl text-center">
						{/* Badge */}
						<div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm">
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="font-medium">AI-Powered Lead Generation</span>
						</div>

						{/* Main heading */}
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
							Find Your Perfect Leads
							<span className="block text-primary relative">
								<span className={`${styles.animatedWord} ${styles.word1}`}>
									Faster
								</span>{" "}
								<span className={`${styles.animatedWord} ${styles.word2}`}>
									Than
								</span>{" "}
								<span className={`${styles.animatedWord} ${styles.word3}`}>
									Ever
								</span>
							</span>
						</h1>

						{/* Description */}
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Leverage advanced AI and semantic search to discover high-quality
							leads, enrich your data with comprehensive insights, and
							accelerate your sales pipeline.
						</p>

						{/* CTA buttons */}
						<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button asChild size="lg" className="group w-full sm:w-auto">
								<Link href="/auth">
									Get Started Free
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="w-full sm:w-auto"
							>
								<Link href="#features">See How It Works</Link>
							</Button>
						</div>

						{/* Trust indicators */}
						<div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>No credit card required</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>14-day free trial</span>
							</div>
							<div className="flex items-center gap-1">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span>Cancel anytime</span>
							</div>
						</div>
					</div>

					{/* Hero Illustration */}
					<div className="mt-16 mx-auto max-w-3xl">
						<div className="relative rounded-xl bg-gradient-to-b from-primary/10 to-accent/10 p-2 shadow-2xl">
							<div className="relative rounded-lg bg-background border shadow-sm overflow-hidden">
								{/* Fake Dashboard */}
								<div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
									<div className="flex gap-1.5">
										<div className="h-3 w-3 rounded-full bg-red-500" />
										<div className="h-3 w-3 rounded-full bg-yellow-500" />
										<div className="h-3 w-3 rounded-full bg-green-500" />
									</div>
									<div className="flex-1 text-center text-sm text-muted-foreground">
										dashboard.rinda-internal.com
									</div>
								</div>

								<div className="p-6">
									{/* Search Bar */}
									<div className="mb-6 flex items-center gap-2 rounded-lg border bg-background p-3 shadow-sm">
										<Search className="h-5 w-5 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											Find CEOs in SaaS companies with 50-200 employees...
										</span>
									</div>

									{/* Results */}
									<div className="space-y-3">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className={`flex items-center gap-4 rounded-lg border p-4 bg-background ${styles.animateFadeIn}`}
												style={{ animationDelay: `${1200 + i * 200}ms` }}
											>
												<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
												<div className="flex-1">
													<div className="h-3 w-32 bg-muted rounded mb-2" />
													<div className="h-2 w-48 bg-muted/60 rounded" />
												</div>
												<div className="flex gap-2">
													<div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
														<Check className="h-4 w-4 text-primary" />
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-24 sm:py-32 relative">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-base font-semibold text-primary">
							Powerful Features
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything you need to find and enrich leads
						</p>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Our platform combines cutting-edge AI technology with intuitive
							design to help you build better sales pipelines.
						</p>
					</div>

					<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
							{/* Smart Search Card */}
							<div
								className={`relative group h-full ${styles.animateFadeIn}`}
								style={{ animationDelay: "100ms" }}
							>
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
											<Search className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-lg font-semibold">Smart Search</h3>
									</div>
									<p className="text-muted-foreground mb-4">
										Advanced semantic search powered by AI to find the most
										relevant leads based on your specific criteria and
										requirements.
									</p>
									<ul className="mt-auto space-y-2 text-sm text-muted-foreground">
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Natural language queries
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											AI-powered relevance scoring
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Custom search criteria
										</li>
									</ul>
								</div>
							</div>

							{/* Data Enrichment Card */}
							<div
								className={`relative group h-full ${styles.animateFadeIn}`}
								style={{ animationDelay: "200ms" }}
							>
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
											<Database className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-lg font-semibold">Data Enrichment</h3>
									</div>
									<p className="text-muted-foreground mb-4">
										Automatically enrich your leads with comprehensive data
										including contact information, company details, and social
										profiles.
									</p>
									<ul className="mt-auto space-y-2 text-sm text-muted-foreground">
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											LinkedIn profile data
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Company information
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Contact details & social links
										</li>
									</ul>
								</div>
							</div>

							{/* Real-time Updates Card */}
							<div
								className={`relative group h-full ${styles.animateFadeIn}`}
								style={{ animationDelay: "300ms" }}
							>
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
											<Zap className="h-6 w-6 text-primary" />
										</div>
										<h3 className="text-lg font-semibold">
											Real-time Processing
										</h3>
									</div>
									<p className="text-muted-foreground mb-4">
										Get instant results with our high-performance processing
										engine that validates and enriches data in real-time.
									</p>
									<ul className="mt-auto space-y-2 text-sm text-muted-foreground">
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Instant validation
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Background processing
										</li>
										<li className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-primary" />
											Export to CSV/Excel
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section
				id="how-it-works"
				className="py-24 sm:py-32 bg-gradient-to-b from-background to-primary/5"
			>
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-base font-semibold text-primary">
							Simple Process
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
							How Rinda Internal Works
						</p>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Get started in minutes and find your perfect leads with our
							streamlined process
						</p>
					</div>

					<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
							{/* Step 1 */}
							<div className="relative">
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
										1
									</div>
									<h3 className="mb-2 text-xl font-semibold">
										Define Your Criteria
									</h3>
									<p className="text-muted-foreground">
										Use natural language to describe your ideal leads. Our AI
										understands complex criteria and preferences.
									</p>
								</div>
								<div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
							</div>

							{/* Step 2 */}
							<div className="relative">
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
										2
									</div>
									<h3 className="mb-2 text-xl font-semibold">
										AI-Powered Search
									</h3>
									<p className="text-muted-foreground">
										Our semantic search engine finds the most relevant leads
										from millions of profiles and companies.
									</p>
								</div>
								<div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
							</div>

							{/* Step 3 */}
							<div className="relative">
								<div className="flex flex-col items-center text-center">
									<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
										3
									</div>
									<h3 className="mb-2 text-xl font-semibold">
										Export & Integrate
									</h3>
									<p className="text-muted-foreground">
										Export enriched leads to CSV/Excel or integrate directly
										with your CRM for seamless workflow.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* CTA */}
					<div className="mt-16 text-center">
						<Button asChild size="lg" className="group">
							<Link href="/auth">
								Try it Now
								<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section id="testimonials" className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-base font-semibold text-primary">
							Testimonials
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
							Loved by sales teams worldwide
						</p>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							See what our customers have to say about Rinda Internal
						</p>
					</div>

					<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{/* Testimonial 1 */}
						<div className="flex flex-col bg-card rounded-2xl p-8 shadow-sm border">
							<div className="flex gap-1 mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i.toString()}
										className="h-5 w-5 fill-primary text-primary"
									/>
								))}
							</div>
							<blockquote className="flex-1">
								<p className="text-muted-foreground">
									"Rinda Internal transformed our lead generation process. We
									found 10x more qualified leads in half the time. The
									AI-powered search is incredibly accurate."
								</p>
							</blockquote>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
								<div>
									<p className="font-semibold">Sarah Chen</p>
									<p className="text-sm text-muted-foreground">
										VP of Sales, TechCorp
									</p>
								</div>
							</div>
						</div>

						{/* Testimonial 2 */}
						<div className="flex flex-col bg-card rounded-2xl p-8 shadow-sm border">
							<div className="flex gap-1 mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i.toString()}
										className="h-5 w-5 fill-primary text-primary"
									/>
								))}
							</div>
							<blockquote className="flex-1">
								<p className="text-muted-foreground">
									"The data enrichment feature is a game-changer. We get
									comprehensive information about every lead, making our
									outreach much more personalized and effective."
								</p>
							</blockquote>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary" />
								<div>
									<p className="font-semibold">Michael Rodriguez</p>
									<p className="text-sm text-muted-foreground">
										Sales Director, StartupHub
									</p>
								</div>
							</div>
						</div>

						{/* Testimonial 3 */}
						<div className="flex flex-col bg-card rounded-2xl p-8 shadow-sm border">
							<div className="flex gap-1 mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i.toString()}
										className="h-5 w-5 fill-primary text-primary"
									/>
								))}
							</div>
							<blockquote className="flex-1">
								<p className="text-muted-foreground">
									"Best investment we've made for our sales team. The ROI is
									incredible - we closed 3 major deals in the first month using
									leads from Rinda Internal."
								</p>
							</blockquote>
							<div className="mt-6 flex items-center gap-3">
								<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
								<div>
									<p className="font-semibold">Emily Thompson</p>
									<p className="text-sm text-muted-foreground">
										CEO, Growth Partners
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative py-16 sm:py-24">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />
				<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to supercharge your lead generation?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							Join thousands of sales teams using Rinda Internal to find and
							enrich their leads with AI-powered precision.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg" className="group">
								<Link href="/auth">
									Start Your Free Trial
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>

						{/* Social proof */}
						<div className="mt-16 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 grayscale opacity-60">
							<div className="text-center">
								<div className="text-4xl font-bold">
									<CountUp end={10000} suffix="+" duration={2500} />
								</div>
								<div className="text-sm text-muted-foreground">
									Active Users
								</div>
							</div>
							<div className="hidden sm:block h-8 w-px bg-border" />
							<div className="text-center">
								<div className="text-4xl font-bold">
									<CountUp end={2} suffix="M+" duration={2500} decimals={0} />
								</div>
								<div className="text-sm text-muted-foreground">Leads Found</div>
							</div>
							<div className="hidden sm:block h-8 w-px bg-border" />
							<div className="text-center">
								<div className="text-4xl font-bold">
									<CountUp end={98} suffix="%" duration={2500} />
								</div>
								<div className="text-sm text-muted-foreground">
									Accuracy Rate
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-muted/50 border-t">
				<div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
						{/* Company */}
						<div>
							<h3 className="text-sm font-semibold mb-4">Company</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/about"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										href="/careers"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Careers
									</Link>
								</li>
								<li>
									<Link
										href="/blog"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Blog
									</Link>
								</li>
							</ul>
						</div>

						{/* Product */}
						<div>
							<h3 className="text-sm font-semibold mb-4">Product</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/features"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="/pricing"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Pricing
									</Link>
								</li>
								<li>
									<Link
										href="/integrations"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Integrations
									</Link>
								</li>
							</ul>
						</div>

						{/* Resources */}
						<div>
							<h3 className="text-sm font-semibold mb-4">Resources</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/docs"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Documentation
									</Link>
								</li>
								<li>
									<Link
										href="/support"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Support
									</Link>
								</li>
								<li>
									<Link
										href="/api"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										API Reference
									</Link>
								</li>
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h3 className="text-sm font-semibold mb-4">Legal</h3>
							<ul className="space-y-3">
								<li>
									<Link
										href="/privacy"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/terms"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Terms of Service
									</Link>
								</li>
								<li>
									<Link
										href="/security"
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										Security
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-8 border-t pt-8">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<div className="flex items-center gap-2">
								<div className="h-6 w-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
									<Sparkles className="h-4 w-4 text-white" />
								</div>
								<span className="text-sm text-muted-foreground">
									© 2024 Rinda Internal. All rights reserved.
								</span>
							</div>

							{/* Social Links */}
							<div className="flex gap-4">
								<Link
									href="#"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</Link>
								<Link
									href="#"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
											clipRule="evenodd"
										/>
									</svg>
								</Link>
								<Link
									href="#"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
											clipRule="evenodd"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
