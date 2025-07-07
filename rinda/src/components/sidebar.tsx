"use client";

import { ChevronRight, FolderPlus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RecentSearch {
	id: string;
	title: string;
	icon?: string;
}

export function Sidebar() {
	const [searchQuery, setSearchQuery] = useState("");

	const recentSearches: RecentSearch[] = [
		{ id: "1", title: "Hotdogs/sausages, cheese in..." },
		{ id: "2", title: "Cheese purchasing, Manila or..." },
		{ id: "3", title: "Haircare experience, sales gro..." },
	];

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
					<Button variant="ghost" className="w-full justify-start gap-2">
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

					<Button variant="ghost" className="w-full justify-start gap-2">
						<FolderPlus className="h-4 w-4" />
						New folder
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<h3 className="text-sm font-medium text-muted-foreground mb-3">
					Recent Searches (Older)
				</h3>

				<div className="space-y-1">
					{recentSearches.map((search) => (
						<Button
							key={search.id}
							variant="ghost"
							className="w-full justify-start gap-2 text-left"
						>
							<ChevronRight className="h-3 w-3" />
							<span className="truncate text-sm">{search.title}</span>
						</Button>
					))}
				</div>
			</div>

			<div className="mt-4 pt-4 border-t">
				<Button variant="ghost" className="w-full justify-start text-sm">
					Load all
				</Button>
			</div>
		</aside>
	);
}
