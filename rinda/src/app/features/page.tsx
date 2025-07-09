import {
	ArrowRight,
	Bot,
	Brain,
	CheckCircle,
	Database,
	FileText,
	Filter,
	Globe,
	Search,
	Shield,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Features | Rinda Internal",
	description:
		"Explore the powerful features that make Rinda Internal the best lead generation platform.",
};

const features = [
	{
		icon: Search,
		title: "Semantic Search",
		description:
			"Use natural language to find exactly the leads you're looking for. Our AI understands context and intent.",
		details: [
			"Natural language queries",
			"Context-aware search",
			"Advanced filtering options",
			"Save and reuse searches",
		],
	},
	{
		icon: Database,
		title: "Data Enrichment",
		description:
			"Automatically enrich leads with comprehensive data from multiple sources.",
		details: [
			"LinkedIn profile data",
			"Company information",
			"Contact details",
			"Social media profiles",
		],
	},
	{
		icon: Brain,
		title: "AI-Powered Scoring",
		description:
			"Let our AI score and prioritize leads based on your ideal customer profile.",
		details: [
			"Custom scoring models",
			"Predictive analytics",
			"Conversion probability",
			"Engagement tracking",
		],
	},
	{
		icon: Zap,
		title: "Real-time Processing",
		description:
			"Get instant results with our high-performance processing engine.",
		details: [
			"Instant validation",
			"Background processing",
			"Bulk operations",
			"API webhooks",
		],
	},
	{
		icon: Filter,
		title: "Advanced Filtering",
		description: "Fine-tune your search with powerful filtering capabilities.",
		details: [
			"Industry filters",
			"Company size",
			"Location targeting",
			"Technology stack",
		],
	},
	{
		icon: FileText,
		title: "Export & Integration",
		description:
			"Export data in multiple formats or integrate directly with your tools.",
		details: [
			"CSV/Excel export",
			"CRM integration",
			"API access",
			"Zapier support",
		],
	},
];

export default function FeaturesPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Powerful Features for Modern Sales Teams
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Everything you need to find, validate, and convert your ideal
							customers.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" className="group">
								<Link href="/auth">
									Start Free Trial
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						{features.map((feature) => (
							<Card key={feature.title} className="p-8">
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
										<feature.icon className="h-6 w-6 text-primary" />
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-semibold mb-2">
											{feature.title}
										</h3>
										<p className="text-muted-foreground mb-4">
											{feature.description}
										</p>
										<ul className="space-y-2">
											{feature.details.map((detail) => (
												<li
													key={detail}
													className="flex items-center gap-2 text-sm"
												>
													<CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
													<span>{detail}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Additional Features */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							And Much More
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Additional features to enhance your lead generation workflow
						</p>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-4 text-center">
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Globe className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Global Coverage</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Access leads from over 100 countries worldwide
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Shield className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">GDPR Compliant</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Full compliance with data protection regulations
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Bot className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">AI Assistant</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Get intelligent suggestions for better results
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Zap className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Lightning Fast</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Process thousands of leads in seconds
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Ready to Experience These Features?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							Start your free trial today and see how Rinda Internal can
							transform your lead generation process.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg" variant="secondary">
								<Link href="/auth">Start Free Trial</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
							>
								<Link href="/demo">Request Demo</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
