import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Integrations | Rinda Internal",
	description:
		"Connect Rinda Internal with your favorite tools and supercharge your workflow.",
};

const integrations = [
	{
		name: "Salesforce",
		category: "CRM",
		description:
			"Sync leads directly to Salesforce and update records in real-time.",
		features: [
			"Bi-directional sync",
			"Custom field mapping",
			"Automated lead assignment",
			"Activity tracking",
		],
		logo: "/integrations/salesforce.svg",
		status: "available",
	},
	{
		name: "HubSpot",
		category: "CRM",
		description: "Import leads to HubSpot and trigger automated workflows.",
		features: [
			"Contact & company sync",
			"Deal creation",
			"Workflow triggers",
			"Custom properties",
		],
		logo: "/integrations/hubspot.svg",
		status: "available",
	},
	{
		name: "Slack",
		category: "Communication",
		description: "Get real-time notifications and collaborate with your team.",
		features: [
			"Lead alerts",
			"Daily summaries",
			"Team notifications",
			"Custom channels",
		],
		logo: "/integrations/slack.svg",
		status: "available",
	},
	{
		name: "Microsoft Teams",
		category: "Communication",
		description: "Share leads and insights directly in Teams channels.",
		features: [
			"Channel notifications",
			"Lead sharing",
			"Bot commands",
			"Activity feeds",
		],
		logo: "/integrations/teams.svg",
		status: "available",
	},
	{
		name: "Zapier",
		category: "Automation",
		description: "Connect with 5000+ apps through Zapier automation.",
		features: [
			"Custom triggers",
			"Multi-step workflows",
			"Conditional logic",
			"5000+ app connections",
		],
		logo: "/integrations/zapier.svg",
		status: "available",
	},
	{
		name: "Pipedrive",
		category: "CRM",
		description: "Streamline your sales pipeline with automated lead imports.",
		features: [
			"Lead & deal sync",
			"Pipeline automation",
			"Activity tracking",
			"Custom fields",
		],
		logo: "/integrations/pipedrive.svg",
		status: "available",
	},
	{
		name: "Google Sheets",
		category: "Productivity",
		description: "Export leads to Google Sheets for custom analysis.",
		features: [
			"Auto-export",
			"Real-time updates",
			"Custom columns",
			"Shared access",
		],
		logo: "/integrations/sheets.svg",
		status: "available",
	},
	{
		name: "Mailchimp",
		category: "Marketing",
		description: "Add leads to email campaigns and nurture sequences.",
		features: [
			"List segmentation",
			"Tag management",
			"Campaign triggers",
			"Engagement tracking",
		],
		logo: "/integrations/mailchimp.svg",
		status: "coming-soon",
	},
	{
		name: "Outreach",
		category: "Sales Engagement",
		description: "Power your outbound campaigns with validated leads.",
		features: [
			"Sequence enrollment",
			"Prospect sync",
			"Task creation",
			"Analytics sync",
		],
		logo: "/integrations/outreach.svg",
		status: "coming-soon",
	},
];

const categories = [
	"All",
	"CRM",
	"Communication",
	"Automation",
	"Productivity",
	"Marketing",
	"Sales Engagement",
];

export default function IntegrationsPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Powerful Integrations
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Connect Rinda Internal with your entire tech stack and automate
							your workflow.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" className="group">
								<Link href="/auth">
									Explore Integrations
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-8 border-b">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="flex flex-wrap gap-2 justify-center">
						{categories.map((category) => (
							<Badge
								key={category}
								variant={category === "All" ? "default" : "outline"}
								className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
							>
								{category}
							</Badge>
						))}
					</div>
				</div>
			</section>

			{/* Integrations Grid */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{integrations.map((integration) => (
							<Card
								key={integration.name}
								className="relative overflow-hidden hover:shadow-lg transition-shadow"
							>
								{integration.status === "coming-soon" && (
									<div className="absolute top-4 right-4">
										<Badge variant="secondary">Coming Soon</Badge>
									</div>
								)}
								<div className="p-8">
									<div className="flex items-start justify-between mb-6">
										<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
											{/* Placeholder for logo */}
											<div className="h-10 w-10 rounded bg-muted-foreground/20" />
										</div>
										{integration.status === "available" && (
											<Button asChild size="sm" variant="ghost">
												<Link href="#">
													<ExternalLink className="h-4 w-4" />
												</Link>
											</Button>
										)}
									</div>
									<h3 className="text-xl font-semibold mb-2">
										{integration.name}
									</h3>
									<Badge variant="outline" className="mb-4">
										{integration.category}
									</Badge>
									<p className="text-muted-foreground mb-6">
										{integration.description}
									</p>
									<ul className="space-y-2">
										{integration.features.map((feature) => (
											<li
												key={feature}
												className="flex items-start gap-2 text-sm"
											>
												<CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* API Section */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Build Custom Integrations
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Use our powerful API to build custom integrations and automate
							your unique workflows.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/api">View API Docs</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/contact">Contact Support</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Integration by the Numbers
						</h2>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-4 text-center">
						<div>
							<div className="text-4xl font-bold text-primary">50+</div>
							<div className="mt-2 text-sm text-muted-foreground">
								Available Integrations
							</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary">10M+</div>
							<div className="mt-2 text-sm text-muted-foreground">
								Leads Synced Daily
							</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary">99.9%</div>
							<div className="mt-2 text-sm text-muted-foreground">
								API Uptime
							</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary">24/7</div>
							<div className="mt-2 text-sm text-muted-foreground">
								Integration Support
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Ready to Connect Your Tools?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							Start integrating Rinda Internal with your favorite tools today.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" variant="secondary">
								<Link href="/auth">Get Started Free</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
