import { ArrowRight, Database, Search, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/count-up";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

export default function Page() {
	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<span className="text-xl font-bold">Rinda Internal</span>
						</div>
						<div className="hidden sm:flex items-center gap-4">
							<Button asChild variant="ghost" size="sm">
								<Link href="#features">Features</Link>
							</Button>
							<Button asChild variant="ghost" size="sm">
								<Link href="/auth">Sign In</Link>
							</Button>
							<Button asChild size="sm">
								<Link href="/auth">Get Started</Link>
							</Button>
						</div>
						<div className="sm:hidden">
							<Button asChild size="sm">
								<Link href="/auth">Get Started</Link>
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-16">
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
							<div className="relative group h-full">
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
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
							<div className="relative group h-full">
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
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
							<div className="relative group h-full">
								<div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
								<div className="relative bg-card p-8 rounded-lg border h-full flex flex-col">
									<div className="flex items-center gap-4 mb-4">
										<div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
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
		</div>
	);
}
