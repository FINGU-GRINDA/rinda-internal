"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Clock, ExternalLink, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnSelector } from "@/components/column-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import type { ValidationStatus } from "../../generated/prisma";

interface WebsetResultsTableProps {
	websetId: string;
}

interface PersonData {
	[key: string]: unknown;
}

const FIELD_LABELS: Record<string, string> = {
	linkedinUrl: "LinkedIn",
	linkedin_url: "LinkedIn",
	profileUrl: "Profile URL",
	firstName: "First Name",
	lastName: "Last Name",
	fullName: "Full Name",
	jobTitle: "Job Title",
	currentPosition: "Current Position",
	currentCompany: "Current Company",
	companySize: "Company Size",
	companyType: "Company Type",
	geoLocation: "Geographic Location",
	profileImage: "Profile Image",
};

const getFieldLabel = (fieldName: string): string => {
	return (
		FIELD_LABELS[fieldName] ||
		fieldName
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim()
	);
};

const formatFieldValue = (value: any, fieldName: string): React.ReactNode => {
	if (value === null || value === undefined || value === "") {
		return <span className="text-sm text-muted-foreground">N/A</span>;
	}

	if (Array.isArray(value)) {
		return (
			<div className="flex flex-wrap gap-1">
				{value.slice(0, 3).map((item, index) => (
					<Badge
						key={`${fieldName}-${index}-${item}`}
						variant="outline"
						className="text-xs"
					>
						{String(item)}
					</Badge>
				))}
				{value.length > 3 && (
					<Badge variant="outline" className="text-xs">
						+{value.length - 3} more
					</Badge>
				)}
			</div>
		);
	}

	if (typeof value === "object") {
		return (
			<span className="text-sm font-mono">
				{JSON.stringify(value, null, 2).substring(0, 50)}...
			</span>
		);
	}

	const stringValue = String(value);

	// Special handling for URLs
	if (
		fieldName.toLowerCase().includes("url") ||
		fieldName.toLowerCase().includes("website")
	) {
		try {
			new URL(
				stringValue.startsWith("http") ? stringValue : `https://${stringValue}`,
			);
			return (
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
					<a
						href={
							stringValue.startsWith("http")
								? stringValue
								: `https://${stringValue}`
						}
						target="_blank"
						rel="noopener noreferrer"
					>
						<ExternalLink className="h-4 w-4" />
					</a>
				</Button>
			);
		} catch {
			// Not a valid URL, display as text
		}
	}

	return <span className="text-sm">{stringValue}</span>;
};

export function WebsetResultsTable({ websetId }: WebsetResultsTableProps) {
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
	const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

	const {
		data: webset,
		isLoading,
		error,
	} = useQuery(
		orpc.webset.liveQuery.experimental_liveOptions({
			input: { id: websetId },
		}),
	);

	// Extract all available fields from the data
	const allAvailableFields = useMemo(() => {
		if (!webset?.WebsetRows) return [];
		const fieldSet = new Set<string>();
		webset.WebsetRows.forEach((row: any) => {
			if (row.originalData && typeof row.originalData === "object") {
				Object.keys(row.originalData).forEach((key) => fieldSet.add(key));
			}
		});
		return Array.from(fieldSet).sort();
	}, [webset]);

	// Load saved columns and order from localStorage on mount or use all available fields
	useEffect(() => {
		if (websetId && allAvailableFields.length > 0) {
			const savedState = localStorage.getItem(`webset-columns-${websetId}`);
			if (savedState) {
				try {
					const parsed = JSON.parse(savedState);
					// Handle both old format (array) and new format (object with columns array)
					const columns = Array.isArray(parsed) ? parsed : parsed.columns || [];
					// Only use saved columns that still exist in the data
					const validColumns = columns.filter((col: string) =>
						allAvailableFields.includes(col),
					);
					setSelectedColumns(
						validColumns.length > 0 ? validColumns : allAvailableFields,
					);
				} catch {
					setSelectedColumns(allAvailableFields);
				}
			} else {
				// Default to showing all available fields
				setSelectedColumns(allAvailableFields);
			}
		}
	}, [websetId, allAvailableFields]);

	// Save column selection and order to localStorage
	const handleColumnsChange = (columns: string[]) => {
		setSelectedColumns(columns);
		localStorage.setItem(
			`webset-columns-${websetId}`,
			JSON.stringify({ columns }),
		);
	};

	// Drag and drop handlers
	const handleDragStart = (
		e: React.DragEvent<HTMLTableCellElement>,
		column: string,
	) => {
		setDraggedColumn(column);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDragEnter = (column: string) => {
		setDragOverColumn(column);
	};

	const handleDragLeave = () => {
		setDragOverColumn(null);
	};

	const handleDrop = (
		e: React.DragEvent<HTMLTableCellElement>,
		targetColumn: string,
	) => {
		e.preventDefault();

		if (draggedColumn && draggedColumn !== targetColumn) {
			const newColumns = [...selectedColumns];
			const draggedIndex = newColumns.indexOf(draggedColumn);
			const targetIndex = newColumns.indexOf(targetColumn);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				// Remove dragged column
				newColumns.splice(draggedIndex, 1);
				// Insert at new position
				newColumns.splice(targetIndex, 0, draggedColumn);
				handleColumnsChange(newColumns);
			}
		}

		setDraggedColumn(null);
		setDragOverColumn(null);
	};

	const handleDragEnd = () => {
		setDraggedColumn(null);
		setDragOverColumn(null);
	};

	// Pan-to-scroll handlers
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// Only start panning if not clicking on interactive elements
		const target = e.target as HTMLElement;
		if (
			target.tagName === "BUTTON" ||
			target.tagName === "A" ||
			target.closest("button") ||
			target.closest("a") ||
			target.closest("th[draggable]")
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

	if (isLoading) {
		return (
			<div className="bg-background border rounded-lg p-6">
				<div className="flex items-center justify-center py-8">
					<div className="flex flex-col items-center gap-3">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						<p className="text-sm text-muted-foreground">
							Loading search results...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-background border rounded-lg p-6">
				<div className="text-center py-8">
					<h2 className="text-lg font-semibold mb-2">Error loading results</h2>
					<p className="text-sm text-muted-foreground">
						{error instanceof Error
							? error.message
							: "An unknown error occurred"}
					</p>
				</div>
			</div>
		);
	}

	if (!webset) {
		return (
			<div className="bg-background border rounded-lg p-6">
				<div className="text-center py-8">
					<h2 className="text-lg font-semibold mb-2">No webset found</h2>
					<p className="text-sm text-muted-foreground">
						The requested search results could not be found.
					</p>
				</div>
			</div>
		);
	}

	const criteriaColors = [
		"bg-purple-100 text-purple-800",
		"bg-blue-100 text-blue-800",
		"bg-green-100 text-green-800",
		"bg-orange-100 text-orange-800",
		"bg-red-100 text-red-800",
	];

	const renderValidationStatus = (
		validationResult: ValidationStatus | undefined,
	) => {
		switch (validationResult) {
			case "VALID":
				return (
					<div className="flex items-center gap-1 text-green-600">
						<Check className="h-4 w-4" />
						<span className="text-xs font-medium">Valid</span>
					</div>
				);
			case "INVALID":
				return (
					<div className="flex items-center gap-1 text-red-600">
						<X className="h-4 w-4" />
						<span className="text-xs font-medium">Invalid</span>
					</div>
				);
			case "PENDING":
				return (
					<div className="flex items-center gap-1 text-amber-600">
						<Clock className="h-4 w-4" />
						<span className="text-xs font-medium">Pending</span>
					</div>
				);
			default:
				return (
					<div className="flex items-center gap-1 text-muted-foreground">
						<Clock className="h-4 w-4" />
						<span className="text-xs">Pending</span>
					</div>
				);
		}
	};

	return (
		<div className="bg-background border rounded-lg overflow-hidden w-full">
			<div className="p-4 border-b">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Search Results</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Query: "{webset.searchQuery}"
						</p>
					</div>
					<div className="flex items-center gap-4">
						<ColumnSelector
							availableFields={webset.WebsetRows}
							selectedColumns={selectedColumns}
							onColumnsChange={handleColumnsChange}
							defaultColumns={allAvailableFields}
						/>
						<div className="text-right">
							<p className="text-sm font-medium">
								{webset.WebsetRows.length} results
							</p>
							<p className="text-xs text-muted-foreground">
								Updated: {new Date(webset.updatedAt).toLocaleString()}
							</p>
						</div>
					</div>
				</div>

				{webset.validationCriterias.length > 0 && (
					<div className="mt-3">
						<p className="text-sm font-medium mb-2">Validation Criteria:</p>
						<div className="flex flex-wrap gap-1">
							{webset.validationCriterias.map(
								(criteria: string, index: number) => (
									<Badge
										key={criteria}
										variant="secondary"
										className={criteriaColors[index % criteriaColors.length]}
									>
										{criteria}
									</Badge>
								),
							)}
						</div>
					</div>
				)}
			</div>

			{webset.WebsetRows.length === 0 ? (
				<div className="text-center py-8">
					<User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">No results found</h3>
					<p className="text-sm text-muted-foreground">
						Your search didn't return any results. Try adjusting your criteria.
					</p>
				</div>
			) : (
				<section
					ref={scrollContainerRef}
					aria-label="Scrollable table container"
					className={`overflow-x-auto overflow-y-hidden max-w-full ${isPanning ? "cursor-grabbing select-none" : "cursor-grab"}`}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
					style={{
						userSelect: isPanning ? "none" : "auto",
						WebkitUserSelect: isPanning ? "none" : "auto",
						msUserSelect: isPanning ? "none" : "auto",
						MozUserSelect: isPanning ? "none" : "auto",
					}}
				>
					<table className="w-full min-w-[1200px]">
						<thead className="bg-muted/50 border-b">
							<tr>
								{selectedColumns.map((column) => (
									<th
										key={column}
										className={`text-left p-3 font-medium cursor-move transition-all min-w-[150px] ${
											draggedColumn === column ? "opacity-50" : ""
										} ${
											dragOverColumn === column
												? "border-l-2 border-primary"
												: ""
										}`}
										draggable
										onDragStart={(e) => handleDragStart(e, column)}
										onDragOver={handleDragOver}
										onDragEnter={() => handleDragEnter(column)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, column)}
										onDragEnd={handleDragEnd}
									>
										{getFieldLabel(column)}
									</th>
								))}
								{webset.validationCriterias.map((criteria: string) => (
									<th
										key={criteria}
										className="text-left p-3 font-medium min-w-[100px] max-w-[150px]"
									>
										<div className="truncate" title={criteria}>
											{criteria}
										</div>
									</th>
								))}
								<th className="text-left p-3 font-medium">Enrichment</th>
							</tr>
						</thead>
						<tbody>
							{webset.WebsetRows.map((row: any) => {
								const person = row.originalData as PersonData;

								return (
									<tr key={row.id} className="border-b hover:bg-muted/30">
										{selectedColumns.map((column) => {
											const value = person?.[column];
											return (
												<td key={column} className="p-3 min-w-[150px]">
													{formatFieldValue(value, column)}
												</td>
											);
										})}
										{webset.validationCriterias.map(
											(criteria: string, index: number) => (
												<td
													key={`${row.id}-${criteria}-${index}`}
													className="p-3 text-center"
												>
													{renderValidationStatus(row.validationData[index])}
												</td>
											),
										)}
										<td className="p-3">
											<div className="flex flex-wrap gap-1">
												{row.enrichmentData.map(
													(enrichment: string, index: number) => (
														<Badge
															key={`${row.id}-enrichment-${index}`}
															variant="outline"
															className="text-xs"
														>
															{enrichment}
														</Badge>
													),
												)}
												{row.enrichmentData.length === 0 && (
													<span className="text-xs text-muted-foreground">
														Pending
													</span>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</section>
			)}
		</div>
	);
}
