"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsetListSkeleton } from "@/components/webset-list-skeleton";
import { orpc } from "@/lib/orpc";

export function Sidebar() {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentWebsetId = searchParams.get("websetId");

	const {
		data: websets,
		isLoading,
		error,
	} = useQuery(orpc.webset.readAll.queryOptions());

	const filteredWebsets = useMemo(() => {
		if (!websets) return [];
		if (!searchQuery) return websets;

		return websets.filter((webset) =>
			webset.searchQuery.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [websets, searchQuery]);

	const handleWebsetClick = (websetId: string) => {
		router.push(`/dashboard/search?websetId=${websetId}`);
	};

	const handleNewSearch = () => {
		router.push("/dashboard");
	};

	return (
		<aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background p-4 flex flex-col">
			<div className="mb-6">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">W</span>
					</div>
					<h2 className="text-lg font-semibold">Websets</h2>
				</div>

				<div className="space-y-2">
					<Button
						variant="ghost"
						className="w-full justify-start gap-2 cursor-pointer"
						onClick={handleNewSearch}
					>
						<Search className="h-4 w-4" />
						New search
					</Button>

					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search past websets"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<h3 className="text-sm font-medium text-muted-foreground mb-3">
					Recent Searches
				</h3>

				{isLoading ? (
					<WebsetListSkeleton />
				) : error ? (
					<div className="text-sm text-destructive px-2">
						Failed to load searches
					</div>
				) : filteredWebsets.length === 0 ? (
					<div className="text-sm text-muted-foreground px-2">
						{searchQuery ? "No searches found" : "No searches yet"}
					</div>
				) : (
					<div className="space-y-1">
						{filteredWebsets.map((webset) => (
							<Button
								key={webset.id}
								variant={currentWebsetId === webset.id ? "secondary" : "ghost"}
								className="w-full justify-start gap-2 text-left cursor-pointer hover:bg-accent"
								onClick={() => handleWebsetClick(webset.id)}
							>
								<ChevronRight className="h-3 w-3 flex-shrink-0" />
								<span className="truncate text-sm">{webset.searchQuery}</span>
							</Button>
						))}
					</div>
				)}
			</div>

			{websets && websets.length > 10 && filteredWebsets.length === 10 && (
				<div className="mt-4 pt-4 border-t">
					<Button
						variant="ghost"
						className="w-full justify-start text-sm cursor-pointer"
					>
						Load all
					</Button>
				</div>
			)}
		</aside>
	);
}
