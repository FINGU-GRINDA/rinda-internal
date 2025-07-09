import {
	FileText,
	HeadphonesIcon,
	MessageSquare,
	Phone,
	Search,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
	title: "Support | Rinda Internal",
	description:
		"Get help with Rinda Internal. Browse our knowledge base or contact our support team.",
};

const supportChannels = [
	{
		icon: FileText,
		title: "Knowledge Base",
		description: "Browse articles and guides to find answers quickly.",
		action: "Browse Articles",
		href: "/docs",
	},
	{
		icon: MessageSquare,
		title: "Live Chat",
		description: "Chat with our support team in real-time.",
		action: "Start Chat",
		href: "#chat",
	},
	{
		icon: Phone,
		title: "Phone Support",
		description: "Speak directly with our support specialists.",
		action: "Call Us",
		href: "tel:+1-555-0123",
	},
	{
		icon: HeadphonesIcon,
		title: "Priority Support",
		description: "Dedicated support for Enterprise customers.",
		action: "Learn More",
		href: "/pricing",
	},
];

const commonIssues = [
	{
		question: "How do I reset my password?",
		answer:
			"You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password.",
	},
	{
		question: "Why are my search results not showing up?",
		answer:
			"This could be due to several reasons: 1) Your search query might be too specific - try broadening it. 2) The validation process might still be running - check the status in your webset. 3) There might be an issue with your account quota - check your usage limits.",
	},
	{
		question: "How do I export my leads to CSV?",
		answer:
			"Navigate to your webset, select the leads you want to export (or use 'Select All'), then click the 'Export' button in the top toolbar. Choose CSV format and your download will begin automatically.",
	},
	{
		question: "Can I integrate Rinda Internal with my CRM?",
		answer:
			"Yes! We support integrations with major CRMs including Salesforce, HubSpot, and Pipedrive. Visit the Integrations page in your account settings to set up the connection.",
	},
	{
		question: "What's included in the free trial?",
		answer:
			"Our 14-day free trial includes full access to all Professional plan features with up to 500 leads. No credit card required to start.",
	},
	{
		question: "How accurate is the AI validation?",
		answer:
			"Our AI validation has an accuracy rate of over 95% for most use cases. The accuracy depends on the quality of your search criteria and validation rules. You can always manually review and adjust results.",
	},
];

const responseTimeData = [
	{ plan: "Starter", email: "< 24 hours", chat: "Business hours", phone: "-" },
	{
		plan: "Professional",
		email: "< 12 hours",
		chat: "Extended hours",
		phone: "Business hours",
	},
	{ plan: "Enterprise", email: "< 2 hours", chat: "24/7", phone: "24/7" },
];

export default function SupportPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							How Can We Help?
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Get the support you need to make the most of Rinda Internal.
						</p>
						<div className="mt-10 max-w-xl mx-auto">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search for help..."
									className="pl-10 h-12"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Support Channels */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
						{supportChannels.map((channel) => (
							<Card
								key={channel.title}
								className="p-6 text-center hover:shadow-lg transition-shadow"
							>
								<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
									<channel.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
								<p className="text-sm text-muted-foreground mb-4">
									{channel.description}
								</p>
								<Button asChild variant="outline" size="sm">
									<Link href={channel.href}>{channel.action}</Link>
								</Button>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Common Issues */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Common Questions
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Quick answers to frequently asked questions
						</p>
					</div>
					<div className="mx-auto max-w-3xl">
						<Accordion type="single" collapsible className="w-full">
							{commonIssues.map((issue, index) => (
								<AccordionItem key={issue.question} value={`item-${index}`}>
									<AccordionTrigger className="text-left">
										{issue.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground">
										{issue.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</section>

			{/* Response Times */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Support Response Times
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							We're committed to providing timely support based on your plan
						</p>
					</div>
					<div className="mx-auto max-w-4xl">
						<Card className="overflow-hidden">
							<table className="w-full">
								<thead className="bg-muted/50">
									<tr>
										<th className="text-left py-4 px-6 font-medium">Plan</th>
										<th className="text-left py-4 px-6 font-medium">Email</th>
										<th className="text-left py-4 px-6 font-medium">
											Live Chat
										</th>
										<th className="text-left py-4 px-6 font-medium">Phone</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{responseTimeData.map((row) => (
										<tr key={row.plan}>
											<td className="py-4 px-6 font-medium">{row.plan}</td>
											<td className="py-4 px-6 text-muted-foreground">
												{row.email}
											</td>
											<td className="py-4 px-6 text-muted-foreground">
												{row.chat}
											</td>
											<td className="py-4 px-6 text-muted-foreground">
												{row.phone}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</Card>
					</div>
				</div>
			</section>

			{/* Contact Form */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
								Contact Support
							</h2>
							<p className="mt-6 text-lg leading-8 text-muted-foreground">
								Can't find what you're looking for? Send us a message and we'll
								get back to you as soon as possible.
							</p>
						</div>
						<Card className="p-8">
							<form className="space-y-6">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<Label htmlFor="first-name">First name</Label>
										<Input
											type="text"
											id="first-name"
											name="first-name"
											className="mt-2"
											required
										/>
									</div>
									<div>
										<Label htmlFor="last-name">Last name</Label>
										<Input
											type="text"
											id="last-name"
											name="last-name"
											className="mt-2"
											required
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										type="email"
										id="email"
										name="email"
										className="mt-2"
										required
									/>
								</div>
								<div>
									<Label htmlFor="subject">Subject</Label>
									<Input
										type="text"
										id="subject"
										name="subject"
										className="mt-2"
										required
									/>
								</div>
								<div>
									<Label htmlFor="message">Message</Label>
									<Textarea
										id="message"
										name="message"
										rows={5}
										className="mt-2"
										required
									/>
								</div>
								<div>
									<Button type="submit" size="lg" className="w-full">
										Send Message
									</Button>
								</div>
							</form>
						</Card>
					</div>
				</div>
			</section>

			{/* Emergency Support */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
							<Zap className="h-8 w-8 text-white" />
						</div>
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Need Emergency Support?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							Enterprise customers can reach our 24/7 emergency support line for
							critical issues.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" variant="secondary">
								<Link href="tel:+1-555-0911">Call Emergency Support</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
