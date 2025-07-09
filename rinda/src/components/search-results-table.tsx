"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { SearchPreviewSkeleton } from "@/components/search-preview-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

	const { data: previewResults, isLoading } = useQuery(
		orpc.webset.previewSearch.queryOptions({
			input: {
				query: searchQuery.q,
			},
			enabled: !!searchQuery.q,
		}),
	);

	// Pan-to-scroll handlers
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// Only start panning if not clicking on interactive elements
		const target = e.target as HTMLElement;
		if (
			target.tagName === "BUTTON" ||
			target.tagName === "A" ||
			target.closest("button") ||
			target.closest("a")
		) {
			return;
		}

		setIsPanning(true);
		setPanStart({ x: e.clientX, y: e.clientY });
		if (scrollContainerRef.current) {
			setScrollStart({
				x: scrollContainerRef.current.scrollLeft,
				y: scrollContainerRef.current.scrollTop,
			});
		}
		// Prevent text selection while dragging
		e.preventDefault();
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isPanning || !scrollContainerRef.current) return;

		const deltaX = e.clientX - panStart.x;
		const deltaY = e.clientY - panStart.y;

		// Apply the scroll with the inverted delta (drag right = scroll left)
		scrollContainerRef.current.scrollLeft = scrollStart.x - deltaX;
		scrollContainerRef.current.scrollTop = scrollStart.y - deltaY;

		// Prevent default to avoid text selection
		e.preventDefault();
	};

	const handleMouseUp = () => {
		setIsPanning(false);
	};

	const handleMouseLeave = () => {
		setIsPanning(false);
	};

	// Add global mouse events to handle mouse up outside the container
	useEffect(() => {
		const handleGlobalMouseUp = () => {
			setIsPanning(false);
		};

		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!isPanning || !scrollContainerRef.current) return;

			const deltaX = e.clientX - panStart.x;
			const deltaY = e.clientY - panStart.y;

			scrollContainerRef.current.scrollLeft = scrollStart.x - deltaX;
			scrollContainerRef.current.scrollTop = scrollStart.y - deltaY;
		};

		if (isPanning) {
			document.addEventListener("mouseup", handleGlobalMouseUp);
			document.addEventListener("mousemove", handleGlobalMouseMove);
		}

		return () => {
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			document.removeEventListener("mousemove", handleGlobalMouseMove);
		};
	}, [isPanning, panStart, scrollStart]);

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

		const stringValue =
			typeof value === "object" ? JSON.stringify(value) : String(value);

		if (typeof value === "string" && value.startsWith("http")) {
			const content = (
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					{stringValue}
				</a>
			);

			return (
				<Tooltip>
					<TooltipTrigger asChild>{content}</TooltipTrigger>
					<TooltipContent className="max-w-xs">
						<p className="break-all">{value}</p>
					</TooltipContent>
				</Tooltip>
			);
		}

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="cursor-help">{stringValue}</span>
				</TooltipTrigger>
				<TooltipContent className="max-w-xs">
					<p className="break-all">{stringValue}</p>
				</TooltipContent>
			</Tooltip>
		);
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

	// Show skeleton while loading
	if (isLoading && searchQuery.q) {
		return <SearchPreviewSkeleton fields={6} rows={5} />;
	}

	return (
		<TooltipProvider>
			<div className="bg-background border rounded-lg overflow-hidden h-full flex flex-col">
				<div className="p-4 border-b flex-shrink-0">
					<h2 className="text-lg font-semibold">Preview search</h2>
					<p className="text-sm text-muted-foreground mt-1">
						{!searchQuery.q
							? "Enter a search query to see preview results"
							: `Showing ${previewResults?.length || 0} preview results with ${allFields.length} fields`}
					</p>
				</div>

				<section
					ref={scrollContainerRef}
					aria-label="Scrollable table container"
					className={`overflow-x-auto overflow-y-auto flex-1 ${isPanning ? "cursor-grabbing select-none" : "cursor-grab"}`}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
					style={
						{
							userSelect: isPanning ? "none" : "auto",
							WebkitUserSelect: isPanning ? "none" : "auto",
							msUserSelect: isPanning ? "none" : "auto",
							MozUserSelect: isPanning ? "none" : "auto",
						} as React.CSSProperties
					}
				>
					<table className="w-full min-w-[1200px] h-full">
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
							) : previewResults && previewResults.length > 0 ? (
								(previewResults as SearchResult[]).map(
									(result: SearchResult, index: number) => (
										<tr
											key={result.id || `result-${index}`}
											className="border-b hover:bg-muted/30"
										>
											{allFields.map((field) => (
												<td key={field} className="p-3">
													{field === "profile_image" ||
													field === "avatar_url" ? (
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
														<div className="max-w-[200px] truncate">
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
				</section>
			</div>
		</TooltipProvider>
	);
}
