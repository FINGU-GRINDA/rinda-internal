"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuerySearchParams } from "@/hooks/use-search-params";
import { orpc } from "@/lib/orpc";

interface SearchResult {
	id?: string;
	name?: string;
	first_name?: string;
	last_name?: string;
	profileImage?: string;
	profile_image?: string;
	avatar_url?: string;
	position?: string;
	title?: string;
	company?: string;
	organization?: string;
	linkedin_url?: string;
	[key: string]: unknown;
}

export function SearchResultsTable() {
	const [searchQuery] = useQuerySearchParams();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { data: previewResults, isLoading } = useQuery(
		orpc.webset.previewSearch.queryOptions({
			input: {
				query: searchQuery.q,
			},
			enabled: !!searchQuery.q,
		}),
	);

	// Add horizontal drag scrolling functionality
	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) return;

		let isDown = false;
		let startX: number;
		let scrollLeft: number;

		const handleMouseDown = (e: MouseEvent) => {
			isDown = true;
			scrollContainer.style.cursor = "grabbing";
			startX = e.pageX - scrollContainer.offsetLeft;
			scrollLeft = scrollContainer.scrollLeft;
		};

		const handleMouseLeave = () => {
			isDown = false;
			scrollContainer.style.cursor = "grab";
		};

		const handleMouseUp = () => {
			isDown = false;
			scrollContainer.style.cursor = "grab";
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - scrollContainer.offsetLeft;
			const walk = (x - startX) * 2; // Scroll speed multiplier
			scrollContainer.scrollLeft = scrollLeft - walk;
		};

		scrollContainer.addEventListener("mousedown", handleMouseDown);
		scrollContainer.addEventListener("mouseleave", handleMouseLeave);
		scrollContainer.addEventListener("mouseup", handleMouseUp);
		scrollContainer.addEventListener("mousemove", handleMouseMove);

		return () => {
			scrollContainer.removeEventListener("mousedown", handleMouseDown);
			scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
			scrollContainer.removeEventListener("mouseup", handleMouseUp);
			scrollContainer.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// Get all unique fields from the results
	const getAllFields = (results: SearchResult[]) => {
		const fieldSet = new Set<string>();
		results.forEach((result) => {
			Object.keys(result).forEach((key) => {
				if (
					result[key] !== null &&
					result[key] !== undefined &&
					result[key] !== ""
				) {
					fieldSet.add(key);
				}
			});
		});
		return Array.from(fieldSet).sort();
	};

	const formatFieldValue = (value: unknown, _fieldName: string) => {
		if (value === null || value === undefined || value === "") {
			return "-";
		}
		if (typeof value === "string" && value.startsWith("http")) {
			return (
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{value.length > 50 ? `${value.substring(0, 50)}...` : value}
				</a>
			);
		}
		if (typeof value === "object") {
			return JSON.stringify(value);
		}
		return String(value);
	};

	const formatFieldName = (fieldName: string) => {
		return fieldName
			.replace(/_/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const allFields = previewResults
		? getAllFields(previewResults as SearchResult[])
		: [];

	const formatName = (result: SearchResult) => {
		if (result.name) return result.name;
		if (result.first_name && result.last_name) {
			return `${result.first_name} ${result.last_name}`;
		}
		if (result.first_name) return result.first_name;
		return "Unknown";
	};

	return (
		<div className="bg-background border rounded-lg overflow-hidden h-full flex flex-col">
			<div className="p-4 border-b flex-shrink-0">
				<h2 className="text-lg font-semibold">Preview search</h2>
				<p className="text-sm text-muted-foreground mt-1">
					{!searchQuery.q
						? "Enter a search query to see preview results"
						: isLoading
							? "Loading preview results..."
							: `Showing ${previewResults?.length || 0} preview results with ${allFields.length} fields`}
				</p>
			</div>

			<div
				ref={scrollContainerRef}
				className="overflow-x-auto overflow-y-auto select-none flex-1"
				style={{ cursor: "grab" }}
			>
				<table className="w-full min-w-max h-full">
					<thead className="bg-muted/50 border-b sticky top-0">
						<tr>
							{allFields.map((field) => (
								<th
									key={field}
									className="text-left p-3 font-medium whitespace-nowrap min-w-[150px]"
								>
									{formatFieldName(field)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{!searchQuery.q ? (
							<tr>
								<td
									colSpan={allFields.length}
									className="p-8 text-center text-muted-foreground"
								>
									Enter a search query to see preview results
								</td>
							</tr>
						) : isLoading ? (
							Array.from({ length: 5 }, (_, rowIndex) => (
								<tr
									key={`skeleton-row-${Date.now()}-${rowIndex}`}
									className="border-b"
								>
									{Array.from({ length: allFields.length }, (_, colIndex) => (
										<td
											key={`skeleton-col-${Date.now()}-${colIndex}`}
											className="p-3"
										>
											<Skeleton className="h-4 w-32" />
										</td>
									))}
								</tr>
							))
						) : previewResults && previewResults.length > 0 ? (
							(previewResults as SearchResult[]).map(
								(result: SearchResult, index: number) => (
									<tr
										key={result.id || `result-${index}`}
										className="border-b hover:bg-muted/30"
									>
										{allFields.map((field) => (
											<td key={field} className="p-3 whitespace-nowrap">
												{field === "profile_image" || field === "avatar_url" ? (
													<div className="flex items-center gap-2">
														<Avatar className="h-8 w-8">
															<AvatarImage
																src={result[field] as string}
																alt={formatName(result)}
															/>
															<AvatarFallback>
																{formatName(result)
																	.split(" ")
																	.map((n: string) => n[0])
																	.join("")
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm text-muted-foreground">
															{result[field] ? "Image" : "No image"}
														</span>
													</div>
												) : (
													<div className="max-w-xs truncate">
														{formatFieldValue(result[field], field)}
													</div>
												)}
											</td>
										))}
									</tr>
								),
							)
						) : (
							<tr>
								<td
									colSpan={allFields.length}
									className="p-8 text-center text-muted-foreground"
								>
									No preview results found for your query
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
