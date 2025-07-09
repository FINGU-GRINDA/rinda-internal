"use client";

import { Suspense } from "react";
import { ClipLoader } from "react-spinners";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { WebsetResultsTable } from "@/components/webset-results-table";

function WebsetContent({ websetId }: { websetId: string }) {
	return (
		<>
			<Sidebar />
			<Navbar />
			<main className="ml-64 mt-16 h-[calc(100vh-4rem)] bg-background">
				<div className="p-6 h-full">
					<WebsetResultsTable websetId={websetId} />
				</div>
			</main>
		</>
	);
}

export default function WebsetPage({
	params,
}: {
	params: { websetId: string };
}) {
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
			<WebsetContent websetId={params.websetId} />
		</Suspense>
	);
}
