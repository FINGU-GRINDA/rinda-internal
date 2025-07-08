"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
	CriteriaEditor,
	type CriteriaItem,
} from "@/components/criteria-editor";
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
import { orpc } from "@/lib/orpc";

export function SearchCriteriaBuilder() {
	const [searchQuery, setSearchQuery] = useQuerySearchParams();
	const { data: dataRequirements } = useQuery(
		orpc.people.createPreSearch.queryOptions({
			input: {
				query: searchQuery.q,
			},
			enabled: !!searchQuery.q && !searchQuery.hasProcessedApiData,
		}),
	);

	// Store generated criteria in URL when API call completes (only once)
	useEffect(() => {
		if (
			dataRequirements &&
			searchQuery.generatedCriteria.length === 0 &&
			!searchQuery.hasProcessedApiData
		) {
			setSearchQuery({
				generatedCriteria: dataRequirements,
				hasProcessedApiData: true,
			});
		}
	}, [
		dataRequirements,
		searchQuery.generatedCriteria.length,
		searchQuery.hasProcessedApiData,
		setSearchQuery,
	]);

	// Track previous query to detect actual changes
	const prevQueryRef = useRef(searchQuery.q);

	// Reset the flag only when the query actually changes (not on mount)
	useEffect(() => {
		if (prevQueryRef.current !== searchQuery.q) {
			prevQueryRef.current = searchQuery.q;
			setSearchQuery({ hasProcessedApiData: false });
		}
	}, [searchQuery.q, setSearchQuery]);
	const router = useRouter();
	const [isAddingCriteria, setIsAddingCriteria] = useState(false);
	const switchId = useId();
	const textareaId = useId();

	// Parse custom criteria from URL
	const customCriteria: CriteriaItem[] = searchQuery.customCriteria.map(
		(item) => {
			const [text, color] = item.split("|");
			return { text, color: (color as CriteriaItem["color"]) || "blue" };
		},
	);

	// Parse enrichments from URL or use defaults
	const enrichments =
		searchQuery.enrichments.length > 0
			? searchQuery.enrichments.map((item) => {
					const [id, checked] = item.split("|");
					const labels = {
						email: "Email",
						experience: "Years of Experience",
						graduation: "Graduation Date",
					};
					return {
						id,
						label: labels[id as keyof typeof labels] || id,
						checked: checked === "true",
					};
				})
			: [
					{ id: "email", label: "Email", checked: false },
					{ id: "experience", label: "Years of Experience", checked: false },
					{ id: "graduation", label: "Graduation Date", checked: false },
				];

	// Get API-generated criteria from URL (persisted)
	const apiCriteria = searchQuery.generatedCriteria.map((v) => ({
		text: v,
		color: "purple" as const,
		isApiGenerated: true,
	}));

	const allCriteria = [
		...apiCriteria,
		...customCriteria.map((c) => ({ ...c, isApiGenerated: false })),
	];

	const handleEnrichmentToggle = (id: string) => {
		const newEnrichments = enrichments.map((e) =>
			e.id === id ? { ...e, checked: !e.checked } : e,
		);

		// Update URL with enrichments
		setSearchQuery({
			enrichments: newEnrichments.map((e) => `${e.id}|${e.checked}`),
		});
	};

	const handleAddCriteria = (criteria: CriteriaItem) => {
		// Check if we're at the limit
		if (allCriteria.length >= 5) {
			return;
		}

		const newCustomCriteria = [...customCriteria, criteria];
		setSearchQuery({
			customCriteria: newCustomCriteria.map((c) => `${c.text}|${c.color}`),
		});
		setIsAddingCriteria(false);
	};

	const handleRemoveCriteria = (index: number, isApiGenerated: boolean) => {
		if (isApiGenerated) {
			// Remove from generated criteria in URL
			const newGeneratedCriteria = searchQuery.generatedCriteria.filter(
				(_, i) => i !== index,
			);
			setSearchQuery({
				generatedCriteria: newGeneratedCriteria,
			});
			return;
		}

		const newCustomCriteria = customCriteria.filter(
			(_, i) => i !== index - apiCriteria.length,
		);
		setSearchQuery({
			customCriteria: newCustomCriteria.map((c) => `${c.text}|${c.color}`),
		});
	};

	const handleExcludePeopleChange = (checked: boolean) => {
		setSearchQuery({ excludePeople: checked });
	};

	const handleResultCountChange = (value: string) => {
		setSearchQuery({ resultCount: value });
	};

	const handleFilterTypeChange = (value: string) => {
		setSearchQuery({ filterType: value });
	};

	const handleBack = () => {
		router.push("/dashboard");
	};

	const credits = 8;
	const hasEnoughCredits = parseInt(searchQuery.resultCount) <= credits;

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
					<Label htmlFor={textareaId}>Search Query</Label>
					<Textarea
						id={textareaId}
						value={searchQuery.q}
						disabled={true}
						placeholder="Enter your search criteria..."
						className="mt-2 min-h-[100px]"
					/>
				</div>

				<div>
					<h3 className="text-sm font-semibold mb-3">Filter Breakdown</h3>
					<div className="space-y-2">
						{allCriteria.map((criterion, index) => (
							<div
								key={`${criterion.text}-${index}`}
								className="flex items-start gap-2"
							>
								<CriteriaTag
									color={criterion.color}
									onRemove={() =>
										handleRemoveCriteria(index, criterion.isApiGenerated)
									}
								>
									{criterion.text}
								</CriteriaTag>
							</div>
						))}
						{isAddingCriteria ? (
							<CriteriaEditor
								onAdd={handleAddCriteria}
								onCancel={() => setIsAddingCriteria(false)}
							/>
						) : allCriteria.length < 5 ? (
							<Button
								variant="ghost"
								size="sm"
								className="gap-2"
								onClick={() => setIsAddingCriteria(true)}
							>
								<Plus className="h-4 w-4" />
								Add Criteria
							</Button>
						) : (
							<p className="text-sm text-muted-foreground">
								Maximum 5 criteria allowed
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Label htmlFor={switchId} className="cursor-pointer">
						Exclude People
					</Label>
					<Switch
						id={switchId}
						checked={searchQuery.excludePeople}
						onCheckedChange={handleExcludePeopleChange}
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
					<ResultCountPicker
						value={searchQuery.resultCount}
						onChange={handleResultCountChange}
					/>
				</div>

				<div className="flex items-center gap-4">
					<Select
						value={searchQuery.filterType}
						onValueChange={handleFilterTypeChange}
					>
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
