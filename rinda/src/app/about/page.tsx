import { ArrowRight, Target, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "About Us | Rinda Internal",
	description:
		"Learn about Rinda Internal's mission to revolutionize lead generation with AI-powered technology.",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							About Rinda Internal
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							We're on a mission to transform how businesses find and connect
							with their ideal customers through intelligent lead generation.
						</p>
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Target className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold">Our Mission</h3>
							<p className="mt-4 text-muted-foreground">
								To empower sales teams with AI-driven insights that help them
								find and engage the right prospects at the right time.
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Users className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold">Our Vision</h3>
							<p className="mt-4 text-muted-foreground">
								A world where every business can effortlessly identify and
								connect with their ideal customers, driving growth and success.
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Zap className="h-8 w-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold">Our Values</h3>
							<p className="mt-4 text-muted-foreground">
								Innovation, integrity, and customer success drive everything we
								do. We believe in the power of technology to solve real business
								challenges.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-8">
							Our Story
						</h2>
						<div className="prose prose-lg mx-auto text-muted-foreground">
							<p>
								Founded in 2023, Rinda Internal was born from a simple
								observation: sales teams were spending countless hours manually
								searching for leads, often with mixed results. We knew there had
								to be a better way.
							</p>
							<p className="mt-6">
								Our founders, with backgrounds in AI and sales technology, came
								together to create a solution that would revolutionize lead
								generation. By leveraging advanced semantic search and machine
								learning, we built a platform that understands what makes a
								perfect lead for each unique business.
							</p>
							<p className="mt-6">
								Today, Rinda Internal serves thousands of sales teams worldwide,
								helping them find qualified leads 10x faster than traditional
								methods. We're proud to be part of their growth journey and
								continue to innovate every day.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to Transform Your Lead Generation?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							Join thousands of sales teams using Rinda Internal to find their
							perfect leads.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg" className="group">
								<Link href="/auth">
									Get Started Free
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href="/contact">Contact Sales</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
