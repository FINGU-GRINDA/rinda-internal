import { Check, HelpCircle, Minus, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: "Pricing | Rinda Internal",
	description:
		"Choose the perfect plan for your lead generation needs. Transparent pricing with no hidden fees.",
};

const plans = [
	{
		name: "Starter",
		price: "$299",
		period: "month",
		description: "Perfect for small teams getting started with lead generation",
		features: [
			{ name: "Up to 1,000 leads/month", included: true },
			{ name: "Basic semantic search", included: true },
			{ name: "Email support", included: true },
			{ name: "CSV export", included: true },
			{ name: "1 user seat", included: true },
			{ name: "AI validation", included: false },
			{ name: "API access", included: false },
			{ name: "Priority support", included: false },
			{ name: "Custom integrations", included: false },
		],
		cta: "Start Free Trial",
		popular: false,
	},
	{
		name: "Professional",
		price: "$799",
		period: "month",
		description: "For growing teams who need advanced features and support",
		features: [
			{ name: "Up to 10,000 leads/month", included: true },
			{ name: "Advanced semantic search", included: true },
			{ name: "Priority email & chat support", included: true },
			{ name: "CSV & Excel export", included: true },
			{ name: "5 user seats", included: true },
			{ name: "AI validation", included: true },
			{ name: "API access", included: true },
			{ name: "CRM integrations", included: true },
			{ name: "Custom integrations", included: false },
		],
		cta: "Start Free Trial",
		popular: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		description: "For large teams with custom requirements and unlimited scale",
		features: [
			{ name: "Unlimited leads", included: true },
			{ name: "Custom AI models", included: true },
			{ name: "Dedicated support team", included: true },
			{ name: "All export formats", included: true },
			{ name: "Unlimited seats", included: true },
			{ name: "Advanced AI validation", included: true },
			{ name: "Full API access", included: true },
			{ name: "All integrations", included: true },
			{ name: "Custom development", included: true },
		],
		cta: "Contact Sales",
		popular: false,
	},
];

const faqs = [
	{
		question: "Can I change plans anytime?",
		answer:
			"Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.",
	},
	{
		question: "What happens if I exceed my lead limit?",
		answer:
			"We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional leads as needed.",
	},
	{
		question: "Do you offer discounts for annual billing?",
		answer:
			"Yes, we offer a 20% discount when you pay annually. Contact our sales team for more details.",
	},
	{
		question: "What's included in the free trial?",
		answer:
			"Our 14-day free trial includes full access to all Professional plan features with up to 500 leads.",
	},
	{
		question: "Can I cancel anytime?",
		answer:
			"Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
	},
	{
		question: "Do you offer refunds?",
		answer:
			"We offer a 30-day money-back guarantee for new customers. If you're not satisfied, we'll refund your payment.",
	},
];

export default function PricingPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Simple, Transparent Pricing
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Choose the perfect plan for your team. No hidden fees, no
							surprises.
						</p>
					</div>
				</div>
			</section>

			{/* Pricing Cards */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
						{plans.map((plan) => (
							<Card
								key={plan.name}
								className={`relative flex flex-col ${
									plan.popular ? "border-primary shadow-lg scale-105" : ""
								}`}
							>
								{plan.popular && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<Badge className="px-4 py-1">Most Popular</Badge>
									</div>
								)}
								<div className="p-8">
									<h3 className="text-2xl font-bold">{plan.name}</h3>
									<p className="mt-4 text-sm text-muted-foreground">
										{plan.description}
									</p>
									<div className="mt-6 flex items-baseline gap-x-2">
										<span className="text-4xl font-bold tracking-tight">
											{plan.price}
										</span>
										{plan.period && (
											<span className="text-sm font-semibold text-muted-foreground">
												/{plan.period}
											</span>
										)}
									</div>
									<Button
										asChild
										className="mt-6 w-full"
										variant={plan.popular ? "default" : "outline"}
										size="lg"
									>
										<Link
											href={plan.name === "Enterprise" ? "/contact" : "/auth"}
										>
											{plan.cta}
										</Link>
									</Button>
								</div>
								<div className="flex flex-1 flex-col justify-between border-t p-8">
									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li key={feature.name} className="flex gap-x-3">
												{feature.included ? (
													<Check className="h-5 w-5 flex-shrink-0 text-primary" />
												) : (
													<X className="h-5 w-5 flex-shrink-0 text-muted-foreground/50" />
												)}
												<span
													className={`text-sm ${
														!feature.included ? "text-muted-foreground/50" : ""
													}`}
												>
													{feature.name}
												</span>
											</li>
										))}
									</ul>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Feature Comparison */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Compare Plans
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							See which features are included in each plan
						</p>
					</div>
					<div className="mx-auto max-w-5xl">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-4 px-4">Features</th>
									<th className="text-center py-4 px-4">Starter</th>
									<th className="text-center py-4 px-4">Professional</th>
									<th className="text-center py-4 px-4">Enterprise</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								<tr>
									<td className="py-4 px-4 font-medium">Leads per month</td>
									<td className="text-center py-4 px-4">1,000</td>
									<td className="text-center py-4 px-4">10,000</td>
									<td className="text-center py-4 px-4">Unlimited</td>
								</tr>
								<tr>
									<td className="py-4 px-4 font-medium">User seats</td>
									<td className="text-center py-4 px-4">1</td>
									<td className="text-center py-4 px-4">5</td>
									<td className="text-center py-4 px-4">Unlimited</td>
								</tr>
								<tr>
									<td className="py-4 px-4 font-medium">AI validation</td>
									<td className="text-center py-4 px-4">
										<Minus className="h-4 w-4 mx-auto text-muted-foreground" />
									</td>
									<td className="text-center py-4 px-4">
										<Check className="h-4 w-4 mx-auto text-primary" />
									</td>
									<td className="text-center py-4 px-4">
										<Check className="h-4 w-4 mx-auto text-primary" />
									</td>
								</tr>
								<tr>
									<td className="py-4 px-4 font-medium">API access</td>
									<td className="text-center py-4 px-4">
										<Minus className="h-4 w-4 mx-auto text-muted-foreground" />
									</td>
									<td className="text-center py-4 px-4">
										<Check className="h-4 w-4 mx-auto text-primary" />
									</td>
									<td className="text-center py-4 px-4">
										<Check className="h-4 w-4 mx-auto text-primary" />
									</td>
								</tr>
								<tr>
									<td className="py-4 px-4 font-medium">Support</td>
									<td className="text-center py-4 px-4">Email</td>
									<td className="text-center py-4 px-4">Priority</td>
									<td className="text-center py-4 px-4">Dedicated</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Frequently Asked Questions
						</h2>
					</div>
					<div className="mx-auto max-w-3xl">
						<TooltipProvider>
							<dl className="space-y-8">
								{faqs.map((faq) => (
									<div
										key={faq.question}
										className="border-b pb-8 last:border-0"
									>
										<dt className="text-lg font-semibold flex items-center gap-2">
											{faq.question}
											<Tooltip>
												<TooltipTrigger>
													<HelpCircle className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">{faq.answer}</p>
												</TooltipContent>
											</Tooltip>
										</dt>
										<dd className="mt-3 text-muted-foreground">{faq.answer}</dd>
									</div>
								))}
							</dl>
						</TooltipProvider>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Start Your Free Trial Today
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							No credit card required. Get instant access to all Professional
							features for 14 days.
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
								<Link href="/contact">Talk to Sales</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
