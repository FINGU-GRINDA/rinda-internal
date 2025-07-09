import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Blog | Rinda Internal",
	description:
		"Insights, tips, and best practices for lead generation and sales success.",
};

const blogPosts = [
	{
		id: 1,
		title: "10 Strategies to Improve Your Lead Generation in 2024",
		excerpt:
			"Discover proven tactics to boost your lead generation efforts and fill your sales pipeline with qualified prospects.",
		author: "Sarah Chen",
		date: "2024-01-15",
		readTime: "5 min read",
		category: "Lead Generation",
		image: "/blog/lead-generation-strategies.jpg",
	},
	{
		id: 2,
		title: "How AI is Revolutionizing Sales Prospecting",
		excerpt:
			"Learn how artificial intelligence is transforming the way sales teams find and qualify leads.",
		author: "Michael Rodriguez",
		date: "2024-01-10",
		readTime: "7 min read",
		category: "AI & Technology",
		image: "/blog/ai-sales-prospecting.jpg",
	},
	{
		id: 3,
		title: "The Complete Guide to Lead Scoring",
		excerpt:
			"Everything you need to know about implementing an effective lead scoring system for your sales team.",
		author: "Emily Thompson",
		date: "2024-01-05",
		readTime: "10 min read",
		category: "Sales Strategy",
		image: "/blog/lead-scoring-guide.jpg",
	},
	{
		id: 4,
		title: "Building a Data-Driven Sales Process",
		excerpt:
			"How to leverage data and analytics to optimize your sales process and close more deals.",
		author: "David Kim",
		date: "2024-01-02",
		readTime: "6 min read",
		category: "Sales Strategy",
		image: "/blog/data-driven-sales.jpg",
	},
	{
		id: 5,
		title: "Personalization at Scale: The Future of Outreach",
		excerpt:
			"Tips and techniques for personalizing your outreach campaigns without sacrificing efficiency.",
		author: "Lisa Johnson",
		date: "2023-12-28",
		readTime: "8 min read",
		category: "Sales Outreach",
		image: "/blog/personalization-scale.jpg",
	},
	{
		id: 6,
		title: "Understanding Semantic Search for Lead Generation",
		excerpt:
			"A deep dive into how semantic search technology can help you find better leads faster.",
		author: "Alex Turner",
		date: "2023-12-20",
		readTime: "9 min read",
		category: "Technology",
		image: "/blog/semantic-search.jpg",
	},
];

const categories = [
	"All",
	"Lead Generation",
	"AI & Technology",
	"Sales Strategy",
	"Sales Outreach",
	"Technology",
];

export default function BlogPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							Rinda Internal Blog
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Insights, tips, and best practices to help you master lead
							generation and sales success.
						</p>
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

			{/* Blog Posts Grid */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{blogPosts.map((post) => (
							<Card
								key={post.id}
								className="overflow-hidden hover:shadow-lg transition-shadow"
							>
								<Link href={`/blog/${post.id}`}>
									<div className="aspect-[16/9] bg-muted" />
									<div className="p-6">
										<div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
											<span className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												{new Date(post.date).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</span>
											<span className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{post.readTime}
											</span>
										</div>
										<h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
											{post.title}
										</h3>
										<p className="text-muted-foreground line-clamp-3 mb-4">
											{post.excerpt}
										</p>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">{post.author}</span>
											<Badge variant="secondary" className="text-xs">
												<Tag className="h-3 w-3 mr-1" />
												{post.category}
											</Badge>
										</div>
									</div>
								</Link>
							</Card>
						))}
					</div>

					{/* Load More */}
					<div className="mt-16 text-center">
						<button
							type="button"
							className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
						>
							Load More Articles
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</section>

			{/* Newsletter CTA */}
			<section className="py-16 sm:py-24 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Stay Updated
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							Get the latest insights and tips delivered to your inbox. No spam,
							just valuable content.
						</p>
						<form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 rounded-md border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<button
								type="submit"
								className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
}
