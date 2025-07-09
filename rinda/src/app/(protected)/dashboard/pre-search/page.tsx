"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { SearchCriteriaBuilder } from "@/components/search-criteria-builder";
import { SearchResultsTable } from "@/components/search-results-table";
import { Sidebar } from "@/components/sidebar";

function PreSearchContent() {
	return (
		<>
			<Sidebar />
			<Navbar />
			<main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-background">
				<div className="p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<SearchResultsTable />
						<SearchCriteriaBuilder />
					</div>
				</div>
			</main>
		</>
	);
}

export default function PreSearchPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen bg-background">
					<div className="flex flex-col items-center gap-4">
						<div className="relative w-10 h-10">
							<div className="absolute inset-0 rounded-full border-4 border-primary/20" />
							<div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
						</div>
						<p className="text-sm text-muted-foreground animate-pulse">
							Loading dashboard...
						</p>
					</div>
				</div>
			}
		>
			<PreSearchContent />
		</Suspense>
	);
}
