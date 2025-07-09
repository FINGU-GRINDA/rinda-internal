import {
	AlertTriangle,
	CheckCircle,
	FileText,
	Globe,
	Lock,
	Shield,
	UserCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Security | Rinda Internal",
	description:
		"Learn about our security measures and commitment to protecting your data.",
};

const securityFeatures = [
	{
		icon: Lock,
		title: "End-to-End Encryption",
		description:
			"All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.",
	},
	{
		icon: UserCheck,
		title: "Multi-Factor Authentication",
		description:
			"Protect your account with TOTP-based 2FA or hardware security keys.",
	},
	{
		icon: Shield,
		title: "SOC 2 Type II Certified",
		description:
			"Annual third-party audits ensure we meet the highest security standards.",
	},
	{
		icon: Globe,
		title: "GDPR Compliant",
		description:
			"Full compliance with data protection regulations including GDPR and CCPA.",
	},
];

const certifications = [
	{
		name: "SOC 2 Type II",
		description:
			"Annual audits for security, availability, and confidentiality",
		status: "Certified",
	},
	{
		name: "ISO 27001",
		description: "Information security management system certification",
		status: "In Progress",
	},
	{
		name: "GDPR",
		description: "EU General Data Protection Regulation compliance",
		status: "Compliant",
	},
	{
		name: "CCPA",
		description: "California Consumer Privacy Act compliance",
		status: "Compliant",
	},
	{
		name: "HIPAA",
		description: "Health Insurance Portability and Accountability Act",
		status: "Available",
	},
];

const securityPractices = [
	{
		category: "Infrastructure Security",
		practices: [
			"Multi-region deployment with automatic failover",
			"DDoS protection and rate limiting",
			"Web Application Firewall (WAF)",
			"Regular security patches and updates",
			"Isolated network architecture",
		],
	},
	{
		category: "Data Security",
		practices: [
			"Encryption at rest and in transit",
			"Regular automated backups",
			"Data retention and deletion policies",
			"Secure data processing pipelines",
			"Anonymous data aggregation",
		],
	},
	{
		category: "Access Control",
		practices: [
			"Role-based access control (RBAC)",
			"Single Sign-On (SSO) support",
			"API key management and rotation",
			"Audit logs for all actions",
			"IP allowlisting capabilities",
		],
	},
	{
		category: "Application Security",
		practices: [
			"Regular penetration testing",
			"Static and dynamic code analysis",
			"Dependency vulnerability scanning",
			"Security headers implementation",
			"Content Security Policy (CSP)",
		],
	},
];

const faqs = [
	{
		question: "How is my data encrypted?",
		answer:
			"We use industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. All sensitive data fields are additionally encrypted at the application level using field-level encryption.",
	},
	{
		question: "Where is my data stored?",
		answer:
			"Data is stored in SOC 2 certified data centers located in the United States and European Union. You can choose your preferred data residency location based on your compliance requirements.",
	},
	{
		question: "Who has access to my data?",
		answer:
			"Access to customer data is strictly limited to authorized personnel on a need-to-know basis. All access is logged and regularly audited. We never sell or share your data with third parties.",
	},
	{
		question: "How do you handle security incidents?",
		answer:
			"We have a comprehensive incident response plan that includes immediate containment, investigation, remediation, and customer notification within 72 hours as required by regulations.",
	},
	{
		question: "Can I export or delete my data?",
		answer:
			"Yes, you have full control over your data. You can export all your data at any time through our API or dashboard. Data deletion requests are processed within 30 days.",
	},
	{
		question: "Do you perform background checks on employees?",
		answer:
			"Yes, all employees undergo comprehensive background checks and sign confidentiality agreements. We also provide regular security training to all staff members.",
	},
];

export default function SecurityPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Shield className="h-8 w-8 text-primary" />
						</div>
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Security First
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Your data security is our top priority. Learn about the measures
							we take to protect your information.
						</p>
					</div>
				</div>
			</section>

			{/* Security Features */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						{securityFeatures.map((feature) => (
							<Card key={feature.title} className="p-8">
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
										<feature.icon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											{feature.title}
										</h3>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Certifications */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Compliance & Certifications
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							We maintain the highest standards of security compliance
						</p>
					</div>
					<div className="mx-auto max-w-5xl">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{certifications.map((cert) => (
								<Card key={cert.name} className="p-6">
									<div className="flex items-start justify-between mb-4">
										<h3 className="text-lg font-semibold">{cert.name}</h3>
										<Badge
											variant={
												cert.status === "Certified" ||
												cert.status === "Compliant"
													? "default"
													: cert.status === "In Progress"
														? "secondary"
														: "outline"
											}
										>
											{cert.status}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{cert.description}
									</p>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Security Practices */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Our Security Practices
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Comprehensive security measures at every level
						</p>
					</div>
					<div className="mx-auto max-w-5xl">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
							{securityPractices.map((section) => (
								<Card key={section.category} className="p-6">
									<h3 className="text-lg font-semibold mb-4">
										{section.category}
									</h3>
									<ul className="space-y-2">
										{section.practices.map((practice) => (
											<li
												key={practice}
												className="flex items-start gap-2 text-sm"
											>
												<CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
												<span className="text-muted-foreground">
													{practice}
												</span>
											</li>
										))}
									</ul>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Security FAQs */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Security Questions
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Common questions about our security practices
						</p>
					</div>
					<div className="mx-auto max-w-3xl">
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq, index) => (
								<AccordionItem key={faq.question} value={`item-${index}`}>
									<AccordionTrigger className="text-left">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</section>

			{/* Bug Bounty */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<Card className="p-8 border-2 border-primary/20">
							<div className="text-center">
								<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<AlertTriangle className="h-8 w-8 text-primary" />
								</div>
								<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
									Security Bug Bounty Program
								</h2>
								<p className="text-lg text-muted-foreground mb-8">
									Help us improve our security and get rewarded. We offer
									bounties up to $10,000 for critical vulnerabilities.
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button asChild size="lg">
										<Link href="/security/bug-bounty">
											View Program Details
										</Link>
									</Button>
									<Button asChild size="lg" variant="outline">
										<Link href="/security/responsible-disclosure">
											Report a Vulnerability
										</Link>
									</Button>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Resources */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Security Resources
						</h2>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						<Card className="p-6">
							<FileText className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Security Whitepaper
							</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Detailed technical overview of our security architecture
							</p>
							<Button asChild variant="outline" size="sm">
								<Link href="/resources/security-whitepaper.pdf">
									Download PDF
								</Link>
							</Button>
						</Card>
						<Card className="p-6">
							<Shield className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-lg font-semibold mb-2">Privacy Policy</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Learn how we collect, use, and protect your personal data
							</p>
							<Button asChild variant="outline" size="sm">
								<Link href="/privacy">Read Policy</Link>
							</Button>
						</Card>
						<Card className="p-6">
							<Lock className="h-8 w-8 text-primary mb-4" />
							<h3 className="text-lg font-semibold mb-2">Terms of Service</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Our commitment to you and your responsibilities
							</p>
							<Button asChild variant="outline" size="sm">
								<Link href="/terms">Read Terms</Link>
							</Button>
						</Card>
					</div>
				</div>
			</section>

			{/* Contact Security Team */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Have Security Concerns?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							Our security team is available 24/7 to address any
							security-related questions or concerns.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" variant="secondary">
								<Link href="mailto:security@rinda-internal.com">
									Contact Security Team
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
