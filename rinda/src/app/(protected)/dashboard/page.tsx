"use client";

import { FileText, Search, TrendingUp, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { Sidebar } from "@/components/sidebar";
import { WorkflowCard } from "@/components/workflow-card";

export default function Page() {
	const workflows = [
		{
			title: "Sales",
			subtitle: "Find customers",
			description: "Source the perfect companies and people to sell to",
			icon: TrendingUp,
		},
		{
			title: "Market research",
			subtitle: "Analyze competitors",
			description: "Find competitors and know everything about them",
			icon: Search,
		},
		{
			title: "Recruiting",
			subtitle: "Source talent",
			description: "Find the exact profiles you need for your business",
			icon: Users,
		},
		{
			title: "Academic research",
			subtitle: "Find research papers",
			description:
				"Search for papers on a topic with summaries, citations, and more",
			icon: FileText,
		},
	];

	return (
		<>
			<Sidebar />
			<Navbar />
			<main className="ml-64 mt-16 min-h-screen bg-background">
				<div className="container mx-auto px-6 py-12">
					<SearchBar />

					<div className="mt-16">
						<h2 className="text-xl font-semibold mb-6">Workflows</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{workflows.map((workflow, index) => (
								<WorkflowCard
									key={index}
									title={workflow.title}
									subtitle={workflow.subtitle}
									description={workflow.description}
									icon={workflow.icon}
								/>
							))}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
