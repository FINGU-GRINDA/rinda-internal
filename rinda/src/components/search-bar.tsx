"use client";

import { ArrowRight, FileText, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "@/app/(protected)/dashboard/page.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuerySearchParams } from "@/hooks/use-search-params";

interface SearchBarProps {
	onFocusChange?: (focused: boolean) => void;
}

export function SearchBar({ onFocusChange }: SearchBarProps = {}) {
	const [searchQueryState, setSearchQueryState] = useQuerySearchParams();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	const category = searchQueryState.category;
	const query = searchQueryState.q;

	const router = useRouter();

	const categories = [
		{ id: "people", label: "People", selected: true, disabled: false },
		{ id: "companies", label: "Companies", selected: false, disabled: true },
		{ id: "papers", label: "Research Papers", selected: false, disabled: true },
		{ id: "articles", label: "Articles", selected: false, disabled: true },
	];

	const handleSearch = async () => {
		if (searchQueryState.q?.trim() && !isLoading) {
			setIsLoading(true);
			try {
				router.push(`/dashboard/pre-search?${searchParams.toString()}`);
			} finally {
				// Note: loading state will be reset when component unmounts due to navigation
				// but adding timeout as fallback
				setTimeout(() => setIsLoading(false), 100);
			}
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold mb-8 text-center">
				Find your perfect list
			</h1>

			<Tabs
				value={category}
				onValueChange={async (v) => {
					await setSearchQueryState((p) => {
						return {
							...p,
							category: v,
						};
					});
				}}
				className="mb-6"
			>
				<TabsList className="w-full h-auto p-1 grid grid-cols-5 gap-1">
					{categories.map((cat) => (
						<TabsTrigger
							key={cat.id}
							value={cat.id}
							disabled={cat.disabled}
							className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{cat.label}
						</TabsTrigger>
					))}
					<Button variant="ghost" size="sm" className="h-9 px-3">
						+
					</Button>
				</TabsList>
			</Tabs>

			<div className="space-y-3">
				<div className="relative">
					<Input
						placeholder="e.g. a software engineer in California..."
						value={query}
						onChange={async (e) => {
							await setSearchQueryState((p) => {
								return {
									...p,
									q: e.target.value,
								};
							});
						}}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						onFocus={() => onFocusChange?.(true)}
						onBlur={() => onFocusChange?.(false)}
						className="pr-12 h-12 text-base"
					/>
					<Button
						size="icon"
						className="absolute right-1 top-1 h-10 w-10"
						onClick={handleSearch}
						disabled={isLoading || !searchQueryState.q?.trim()}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ArrowRight className="h-4 w-4" />
						)}
					</Button>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" className="gap-2" disabled>
							<FileText className="h-4 w-4" />
							Start from CSV
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Coming soon</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
