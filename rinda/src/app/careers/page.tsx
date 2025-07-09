import { ArrowRight, Briefcase, Heart, Rocket, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Careers | Rinda Internal",
	description:
		"Join our team and help revolutionize lead generation. Explore career opportunities at Rinda Internal.",
};

const openPositions = [
	{
		title: "Senior Frontend Engineer",
		department: "Engineering",
		location: "Remote",
		type: "Full-time",
		description:
			"Help build our next-generation lead generation platform using React, Next.js, and TypeScript.",
	},
	{
		title: "AI/ML Engineer",
		department: "Engineering",
		location: "Remote",
		type: "Full-time",
		description:
			"Develop and improve our semantic search algorithms and lead scoring models.",
	},
	{
		title: "Sales Development Representative",
		department: "Sales",
		location: "New York, NY",
		type: "Full-time",
		description:
			"Drive new business growth by identifying and qualifying potential customers.",
	},
	{
		title: "Customer Success Manager",
		department: "Customer Success",
		location: "Remote",
		type: "Full-time",
		description:
			"Ensure our customers achieve their goals and maximize value from our platform.",
	},
];

export default function CareersPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Join Our Team
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Help us build the future of lead generation and make a real impact
							on how businesses grow.
						</p>
						<div className="mt-10">
							<Button asChild size="lg">
								<Link href="#open-positions">
									View Open Positions
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Why Join Us Section */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Why Join Rinda Internal?
						</h2>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Rocket className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Growth</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Rapid career growth opportunities in a fast-scaling startup
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Users className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Team</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Work with talented people who are passionate about what they do
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Heart className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Benefits</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Competitive salary, equity, health insurance, and flexible PTO
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Briefcase className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Remote</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Work from anywhere with our remote-first culture
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Open Positions Section */}
			<section id="open-positions" className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Open Positions
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Find your next role and join us in our mission
						</p>
					</div>
					<div className="mx-auto max-w-4xl space-y-6">
						{openPositions.map((position) => (
							<Card
								key={position.title}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div className="flex-1">
										<h3 className="text-xl font-semibold">{position.title}</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											{position.department} • {position.location} •{" "}
											{position.type}
										</p>
										<p className="mt-3 text-muted-foreground">
											{position.description}
										</p>
									</div>
									<Button asChild>
										<Link
											href={`/careers/${position.title.toLowerCase().replace(/ /g, "-")}`}
										>
											Apply Now
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Don't See the Right Role?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							We're always looking for talented people. Send us your resume and
							we'll keep you in mind for future opportunities.
						</p>
						<div className="mt-10">
							<Button asChild size="lg" variant="outline">
								<Link href="mailto:careers@rinda-internal.com">
									Send Your Resume
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
