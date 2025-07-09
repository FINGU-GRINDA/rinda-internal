import {
	ArrowRight,
	Book,
	Code,
	FileText,
	Lightbulb,
	PlayCircle,
	Rocket,
	Search,
	Settings,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
	title: "Documentation | Rinda Internal",
	description:
		"Everything you need to know to get the most out of Rinda Internal.",
};

const quickStartGuides = [
	{
		title: "Getting Started",
		description: "Set up your account and create your first webset in minutes.",
		icon: Rocket,
		href: "/docs/getting-started",
		time: "5 min",
	},
	{
		title: "Creating Websets",
		description: "Learn how to use semantic search to find your ideal leads.",
		icon: Search,
		href: "/docs/creating-websets",
		time: "10 min",
	},
	{
		title: "AI Validation",
		description: "Understand how our AI validates and enriches your leads.",
		icon: Lightbulb,
		href: "/docs/ai-validation",
		time: "8 min",
	},
	{
		title: "Integrations",
		description: "Connect Rinda Internal with your favorite tools.",
		icon: Settings,
		href: "/docs/integrations",
		time: "15 min",
	},
];

const documentationSections = [
	{
		title: "Platform Basics",
		items: [
			{ title: "Account Setup", href: "/docs/account-setup" },
			{ title: "User Management", href: "/docs/user-management" },
			{ title: "Billing & Plans", href: "/docs/billing" },
			{ title: "Security Settings", href: "/docs/security" },
		],
	},
	{
		title: "Using Websets",
		items: [
			{ title: "Search Basics", href: "/docs/search-basics" },
			{ title: "Advanced Search", href: "/docs/advanced-search" },
			{ title: "Validation Criteria", href: "/docs/validation-criteria" },
			{ title: "Export Options", href: "/docs/export" },
		],
	},
	{
		title: "API & Developers",
		items: [
			{ title: "API Reference", href: "/api" },
			{ title: "Authentication", href: "/docs/api-auth" },
			{ title: "Webhooks", href: "/docs/webhooks" },
			{ title: "Rate Limits", href: "/docs/rate-limits" },
		],
	},
	{
		title: "Best Practices",
		items: [
			{ title: "Search Strategies", href: "/docs/search-strategies" },
			{ title: "Lead Scoring", href: "/docs/lead-scoring" },
			{ title: "Data Quality", href: "/docs/data-quality" },
			{ title: "Team Collaboration", href: "/docs/collaboration" },
		],
	},
];

const popularArticles = [
	{
		title: "How to write effective semantic search queries",
		category: "Search",
		readTime: "5 min",
	},
	{
		title: "Understanding validation scores",
		category: "AI Validation",
		readTime: "7 min",
	},
	{
		title: "Bulk export best practices",
		category: "Export",
		readTime: "4 min",
	},
	{
		title: "Setting up Salesforce integration",
		category: "Integrations",
		readTime: "10 min",
	},
	{
		title: "Managing team permissions",
		category: "Admin",
		readTime: "6 min",
	},
];

export default function DocumentationPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Documentation
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Everything you need to know to get the most out of Rinda Internal.
						</p>
						<div className="mt-10 max-w-xl mx-auto">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search documentation..."
									className="pl-10 h-12"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Start */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Quick Start Guides
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Get up and running quickly with our step-by-step guides
						</p>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						{quickStartGuides.map((guide) => (
							<Card
								key={guide.title}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<Link href={guide.href}>
									<div className="flex items-start gap-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
											<guide.icon className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-semibold mb-2">
												{guide.title}
											</h3>
											<p className="text-muted-foreground text-sm mb-2">
												{guide.description}
											</p>
											<div className="flex items-center gap-2 text-sm text-primary">
												<span>{guide.time} read</span>
												<ArrowRight className="h-4 w-4" />
											</div>
										</div>
									</div>
								</Link>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Documentation Sections */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Browse Documentation
						</h2>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						{documentationSections.map((section) => (
							<div key={section.title}>
								<h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
									<Book className="h-5 w-5 text-primary" />
									{section.title}
								</h3>
								<ul className="space-y-3">
									{section.items.map((item) => (
										<li key={item.href}>
											<Link
												href={item.href}
												className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
											>
												<FileText className="h-4 w-4" />
												<span>{item.title}</span>
												<ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Popular Articles */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Popular Articles
						</h2>
					</div>
					<div className="mx-auto max-w-4xl">
						<div className="space-y-4">
							{popularArticles.map((article) => (
								<Card
									key={article.title}
									className="p-6 hover:shadow-md transition-shadow"
								>
									<Link
										href="#"
										className="flex items-center justify-between group"
									>
										<div>
											<h3 className="font-semibold group-hover:text-primary transition-colors">
												{article.title}
											</h3>
											<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
												<span>{article.category}</span>
												<span>•</span>
												<span>{article.readTime} read</span>
											</div>
										</div>
										<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
									</Link>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Video Tutorials */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Video Tutorials
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Learn by watching our comprehensive video guides
						</p>
					</div>
					<div className="mx-auto max-w-4xl">
						<Card className="p-8 text-center">
							<PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								Rinda Internal Platform Overview
							</h3>
							<p className="text-muted-foreground mb-6">
								Get a complete walkthrough of the platform in under 10 minutes
							</p>
							<Button asChild>
								<Link href="/docs/videos">View All Videos</Link>
							</Button>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Still Have Questions?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							Our support team is here to help you succeed with Rinda Internal.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/support">Contact Support</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/api">
									<Code className="mr-2 h-4 w-4" />
									API Reference
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
