"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClipLoader } from "react-spinners";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { WebsetResultsTable } from "@/components/webset-results-table";

function SearchContent() {
	const searchParams = useSearchParams();
	const websetId = searchParams.get("websetId");

	if (!websetId) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="text-center">
					<h2 className="text-lg font-semibold mb-2">No search results</h2>
					<p className="text-sm text-muted-foreground">
						Webset ID is required to display search results
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<Sidebar />
			<Navbar />
			<main className="ml-64 mt-16 min-h-screen bg-background">
				<div className="p-6">
					<WebsetResultsTable websetId={websetId} />
				</div>
			</main>
		</>
	);
}

export default function SearchPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen bg-background">
					<div className="flex flex-col items-center gap-4">
						<ClipLoader color="#6366f1" size={40} speedMultiplier={0.8} />
						<p className="text-sm text-muted-foreground">
							Loading search results...
						</p>
					</div>
				</div>
			}
		>
			<SearchContent />
		</Suspense>
	);
}
