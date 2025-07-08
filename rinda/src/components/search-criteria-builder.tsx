"use client";

import { AlertCircle, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CriteriaTag } from "@/components/criteria-tag";
import { EnrichmentToggle } from "@/components/enrichment-toggle";
import { ResultCountPicker } from "@/components/result-count-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQuerySearchParams } from "@/hooks/use-search-params";

export function SearchCriteriaBuilder() {
	const [searchQuery, setSearchQuery] = useQuerySearchParams();
	const router = useRouter();
	const [excludePeople, setExcludePeople] = useState(false);
	const [resultCount, setResultCount] = useState("25");
	const [filterType, setFilterType] = useState("everything");

	const [enrichments, setEnrichments] = useState([
		{ id: "email", label: "Email", checked: false },
		{ id: "experience", label: "Years of Experience", checked: false },
		{ id: "graduation", label: "Graduation Date", checked: false },
	]);

	const parsedCriteria = searchQuery.requirements.map((v) => {
		return {
			text: v,
			color: "purple",
		};
	});

	const handleEnrichmentToggle = (id: string) => {
		setEnrichments((prev) =>
			prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)),
		);
	};

	const handleBack = () => {
		router.push("/");
	};

	const credits = 8;
	const hasEnoughCredits = parseInt(resultCount) <= credits;

	return (
		<div className="bg-background border rounded-lg p-6 space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" onClick={handleBack}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h2 className="text-lg font-semibold">Search Criteria</h2>
			</div>

			<div className="space-y-4">
				<div>
					<Label htmlFor="search-query">Search Query</Label>
					<Textarea
						id="search-query"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Enter your search criteria..."
						className="mt-2 min-h-[100px]"
					/>
				</div>

				<div>
					<h3 className="text-sm font-semibold mb-3">Filter Breakdown</h3>
					<div className="space-y-2">
						{parsedCriteria.map((criterion) => (
							<div key={criterion.text} className="flex items-start gap-2">
								<CriteriaTag color={criterion.color}>
									{criterion.text}
								</CriteriaTag>
							</div>
						))}
						<Button variant="ghost" size="sm" className="gap-2">
							<Plus className="h-4 w-4" />
							Add Criteria
						</Button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Label htmlFor="exclude-people" className="cursor-pointer">
						Exclude People
					</Label>
					<Switch
						id="exclude-people"
						checked={excludePeople}
						onCheckedChange={setExcludePeople}
					/>
				</div>
			</div>

			<div>
				<h3 className="text-sm font-semibold mb-3">Enrichments</h3>
				<EnrichmentToggle
					enrichments={enrichments}
					onToggle={handleEnrichmentToggle}
				/>
				<Button variant="ghost" size="sm" className="gap-2 mt-3">
					<Plus className="h-4 w-4" />
					Custom
				</Button>
			</div>

			{!hasEnoughCredits && (
				<div className="flex items-center gap-2 text-destructive">
					<AlertCircle className="h-4 w-4" />
					<p className="text-sm">
						You only have enough credits for {credits} results.
					</p>
				</div>
			)}

			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<span className="text-sm font-medium">Results:</span>
					<ResultCountPicker value={resultCount} onChange={setResultCount} />
				</div>

				<div className="flex items-center gap-4">
					<Select value={filterType} onValueChange={setFilterType}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="everything">Everything</SelectItem>
							<SelectItem value="verified">Verified Only</SelectItem>
							<SelectItem value="recent">Recent Activity</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button
					className="w-full"
					disabled={!hasEnoughCredits}
					variant={hasEnoughCredits ? "default" : "secondary"}
				>
					Search
				</Button>
			</div>
		</div>
	);
}
