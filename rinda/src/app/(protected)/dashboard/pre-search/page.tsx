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
			<main className="ml-64 mt-16 min-h-screen bg-background">
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
		<Suspense fallback={<div>Loading...</div>}>
			<PreSearchContent />
		</Suspense>
	);
}
