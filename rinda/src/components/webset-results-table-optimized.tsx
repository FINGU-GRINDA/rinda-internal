"use client";

import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Clock, ExternalLink, User, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnSelector } from "@/components/column-selector";
import { PartialLoadingSkeleton } from "@/components/partial-loading-skeleton";
import { TableSkeleton } from "@/components/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
			.replace(/_/g, " ")
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim()
	);
};

// Memoized truncated text component
const TruncatedText = memo(
	({ text, className = "text-sm" }: { text: string; className?: string }) => {
		if (!text) {
			return <span className={className}>{text}</span>;
		}

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={`${className} block truncate cursor-help`}
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{text}
					</span>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={8}>
					<p className="max-w-xs break-words">{text}</p>
				</TooltipContent>
			</Tooltip>
		);
	},
);

TruncatedText.displayName = "TruncatedText";

// Memoized format field value component
const FormatFieldValue = memo(
	({ value, fieldName }: { value: unknown; fieldName: string }) => {
		if (value === null || value === undefined || value === "") {
			return <span className="text-sm text-muted-foreground">N/A</span>;
		}

		if (Array.isArray(value)) {
			const displayItems = value.slice(0, 2);
			const hasMore = value.length > 2;

			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex items-center gap-1 cursor-help">
							{displayItems.map((item, index) => (
								<Badge
									key={`${fieldName}-${index}-${item}`}
									variant="outline"
									className="text-xs"
								>
									{String(item)}
								</Badge>
							))}
							{hasMore && (
								<Badge variant="outline" className="text-xs">
									+{value.length - 2}
								</Badge>
							)}
						</div>
					</TooltipTrigger>
					<TooltipContent side="top" sideOffset={8}>
						<div className="max-w-xs">
							<p className="font-medium mb-1">All items:</p>
							<div className="flex flex-wrap gap-1">
								{value.map((item, index) => (
									<Badge
										key={`tooltip-${fieldName}-${index}-${item}`}
										variant="outline"
										className="text-xs"
									>
										{String(item)}
									</Badge>
								))}
							</div>
						</div>
					</TooltipContent>
				</Tooltip>
			);
		}

		if (typeof value === "object") {
			const jsonString = JSON.stringify(value, null, 2);
			return <TruncatedText text={jsonString} className="text-sm font-mono" />;
		}

		const stringValue = String(value);

		// Special handling for URLs
		if (
			fieldName.toLowerCase().includes("url") ||
			fieldName.toLowerCase().includes("website")
		) {
			try {
				new URL(
					stringValue.startsWith("http")
						? stringValue
						: `https://${stringValue}`,
				);
				return (
					<Tooltip>
						<TooltipTrigger asChild>
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
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={8}>
							<p className="max-w-xs break-all">{stringValue}</p>
						</TooltipContent>
					</Tooltip>
				);
			} catch {
				// Not a valid URL, display as text
			}
		}

		return <TruncatedText text={stringValue} />;
	},
);

FormatFieldValue.displayName = "FormatFieldValue";

// Memoized validation status component
const ValidationStatusCell = memo(
	({
		validationResult,
	}: {
		validationResult: ValidationStatus | undefined;
	}) => {
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
	},
);

ValidationStatusCell.displayName = "ValidationStatusCell";

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function WebsetResultsTable({ websetId }: WebsetResultsTableProps) {
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
	const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const headerScrollRef = useRef<HTMLDivElement>(null);
	const [isPanning, setIsPanning] = useState(false);
	const panState = useRef({
		startX: 0,
		startY: 0,
		scrollStartX: 0,
		scrollStartY: 0,
		animationFrame: null as number | null,
	});

	const {
		data: webset,
		isLoading,
		error,
	} = useQuery(
		orpc.webset.liveQuery.experimental_liveOptions({
			input: { id: websetId },
			gcTime: 0,
		}),
	);

	// Extract all available fields from the data with memoization
	const allAvailableFields = useMemo(() => {
		if (!webset?.WebsetRows) return [];
		const fieldSet = new Set<string>();
		webset.WebsetRows.forEach((row) => {
			if (row.originalData && typeof row.originalData === "object") {
				Object.keys(row.originalData).forEach((key) => fieldSet.add(key));
			}
		});
		return Array.from(fieldSet).sort();
	}, [webset?.WebsetRows]);

	// Load saved columns and order from localStorage on mount or use all available fields
	useEffect(() => {
		if (websetId && allAvailableFields.length > 0) {
			const savedState = localStorage.getItem(`webset-columns-${websetId}`);
			if (savedState) {
				try {
					const parsed = JSON.parse(savedState);
					const columns = Array.isArray(parsed) ? parsed : parsed.columns || [];
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
				setSelectedColumns(allAvailableFields);
			}
		}
	}, [websetId, allAvailableFields]);

	// Debounced localStorage save
	const saveColumnsToLocalStorage = useMemo(
		() =>
			debounce((columns: string[]) => {
				localStorage.setItem(
					`webset-columns-${websetId}`,
					JSON.stringify({ columns }),
				);
			}, 300),
		[websetId],
	);

	// Save column selection and order to localStorage
	const handleColumnsChange = useCallback(
		(columns: string[]) => {
			setSelectedColumns(columns);
			saveColumnsToLocalStorage(columns);
		},
		[saveColumnsToLocalStorage],
	);

	// Virtualizer setup
	const rowVirtualizer = useVirtualizer({
		count: webset?.WebsetRows.length || 0,
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => 48, // Estimated row height
		overscan: 10, // Number of rows to render outside visible area
	});

	// Optimized pan-to-scroll handlers with requestAnimationFrame
	const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
		panState.current.startX = e.clientX;
		panState.current.startY = e.clientY;
		if (scrollContainerRef.current) {
			panState.current.scrollStartX = scrollContainerRef.current.scrollLeft;
			panState.current.scrollStartY = scrollContainerRef.current.scrollTop;
		}
		e.preventDefault();
	}, []);

	const updateScroll = useCallback((clientX: number, clientY: number) => {
		if (!scrollContainerRef.current) return;

		const deltaX = clientX - panState.current.startX;
		const deltaY = clientY - panState.current.startY;

		const newScrollLeft = panState.current.scrollStartX - deltaX;
		scrollContainerRef.current.scrollLeft = newScrollLeft;
		scrollContainerRef.current.scrollTop =
			panState.current.scrollStartY - deltaY;

		// Sync header scroll
		if (headerScrollRef.current) {
			headerScrollRef.current.scrollLeft = newScrollLeft;
		}
	}, []);

	// Handle scroll synchronization
	const handleBodyScroll = useCallback(() => {
		if (scrollContainerRef.current && headerScrollRef.current && !isPanning) {
			headerScrollRef.current.scrollLeft =
				scrollContainerRef.current.scrollLeft;
		}
	}, [isPanning]);

	const handleHeaderScroll = useCallback(() => {
		if (scrollContainerRef.current && headerScrollRef.current && !isPanning) {
			scrollContainerRef.current.scrollLeft =
				headerScrollRef.current.scrollLeft;
		}
	}, [isPanning]);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isPanning) return;

			if (panState.current.animationFrame) {
				cancelAnimationFrame(panState.current.animationFrame);
			}

			panState.current.animationFrame = requestAnimationFrame(() => {
				updateScroll(e.clientX, e.clientY);
			});

			e.preventDefault();
		},
		[isPanning, updateScroll],
	);

	const handleMouseUp = useCallback(() => {
		setIsPanning(false);
		if (panState.current.animationFrame) {
			cancelAnimationFrame(panState.current.animationFrame);
			panState.current.animationFrame = null;
		}
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsPanning(false);
		if (panState.current.animationFrame) {
			cancelAnimationFrame(panState.current.animationFrame);
			panState.current.animationFrame = null;
		}
	}, []);

	// Global mouse events for panning
	useEffect(() => {
		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (!isPanning) return;

			if (panState.current.animationFrame) {
				cancelAnimationFrame(panState.current.animationFrame);
			}

			panState.current.animationFrame = requestAnimationFrame(() => {
				updateScroll(e.clientX, e.clientY);
			});
		};

		const handleGlobalMouseUp = () => {
			setIsPanning(false);
			if (panState.current.animationFrame) {
				cancelAnimationFrame(panState.current.animationFrame);
				panState.current.animationFrame = null;
			}
		};

		if (isPanning) {
			document.addEventListener("mousemove", handleGlobalMouseMove);
			document.addEventListener("mouseup", handleGlobalMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
			if (panState.current.animationFrame) {
				cancelAnimationFrame(panState.current.animationFrame);
			}
		};
	}, [isPanning, updateScroll]);

	// Drag and drop handlers
	const handleDragStart = useCallback(
		(e: React.DragEvent<HTMLTableCellElement>, column: string) => {
			setDraggedColumn(column);
			e.dataTransfer.effectAllowed = "move";
		},
		[],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLTableCellElement>) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		},
		[],
	);

	const handleDragEnter = useCallback((column: string) => {
		setDragOverColumn(column);
	}, []);

	const handleDragLeave = useCallback(() => {
		setDragOverColumn(null);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLTableCellElement>, targetColumn: string) => {
			e.preventDefault();

			if (draggedColumn && draggedColumn !== targetColumn) {
				const newColumns = [...selectedColumns];
				const draggedIndex = newColumns.indexOf(draggedColumn);
				const targetIndex = newColumns.indexOf(targetColumn);

				if (draggedIndex !== -1 && targetIndex !== -1) {
					newColumns.splice(draggedIndex, 1);
					newColumns.splice(targetIndex, 0, draggedColumn);
					handleColumnsChange(newColumns);
				}
			}

			setDraggedColumn(null);
			setDragOverColumn(null);
		},
		[draggedColumn, selectedColumns, handleColumnsChange],
	);

	const handleDragEnd = useCallback(() => {
		setDraggedColumn(null);
		setDragOverColumn(null);
	}, []);

	if (isLoading) {
		return <TableSkeleton />;
	}

	if (error && !isLoading) {
		if (
			error instanceof Error &&
			(error.name === "CancelledError" || error.name === "AbortError")
		) {
			return <TableSkeleton />;
		}

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

	const isRecentlyCreated =
		Date.now() - new Date(webset.createdAt).getTime() < 2 * 60 * 1000;
	const isProcessing = isRecentlyCreated && webset.WebsetRows.length === 0;

	const criteriaColors = [
		"bg-purple-100 text-purple-800",
		"bg-blue-100 text-blue-800",
		"bg-green-100 text-green-800",
		"bg-orange-100 text-orange-800",
		"bg-red-100 text-red-800",
	];

	if (isProcessing) {
		return (
			<TooltipProvider>
				<PartialLoadingSkeleton
					webset={webset}
					selectedColumns={selectedColumns}
				/>
			</TooltipProvider>
		);
	}

	const virtualItems = rowVirtualizer.getVirtualItems();

	return (
		<TooltipProvider>
			<div className="bg-background border rounded-lg overflow-hidden w-full h-full flex flex-col">
				<div className="p-4 border-b flex-shrink-0">
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
					<div className="text-center py-8 flex-1 flex items-center justify-center">
						<div>
							<User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No results found</h3>
							<p className="text-sm text-muted-foreground">
								Your search didn't return any results. Try adjusting your
								criteria.
							</p>
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col overflow-hidden">
						<div
							ref={headerScrollRef}
							className="overflow-x-auto overflow-y-hidden flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
							onScroll={handleHeaderScroll}
						>
							<table
								className="w-full min-w-[1200px]"
								style={{ tableLayout: "fixed" }}
							>
								<thead className="bg-muted border-b">
									<tr>
										{selectedColumns.map((column) => (
											<th
												key={column}
												className={`text-left p-3 font-medium cursor-move transition-all ${
													draggedColumn === column ? "brightness-75" : ""
												} ${
													dragOverColumn === column
														? "border-l-2 border-primary"
														: ""
												}`}
												style={{ width: "200px", minWidth: "200px" }}
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
												className="text-left p-3 font-medium"
												style={{ width: "150px", minWidth: "150px" }}
											>
												<div className="truncate" title={criteria}>
													{criteria}
												</div>
											</th>
										))}
										<th
											className="text-left p-3 font-medium"
											style={{ width: "200px", minWidth: "200px" }}
										>
											Enrichment
										</th>
									</tr>
								</thead>
							</table>
						</div>
						<section
							ref={scrollContainerRef}
							aria-label="Scrollable table container"
							className={`overflow-x-auto overflow-y-auto flex-1 relative ${isPanning ? "cursor-grabbing select-none" : "cursor-grab"}`}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseLeave}
							onScroll={handleBodyScroll}
							style={
								{
									userSelect: isPanning ? "none" : "auto",
									WebkitUserSelect: isPanning ? "none" : "auto",
									msUserSelect: isPanning ? "none" : "auto",
									MozUserSelect: isPanning ? "none" : "auto",
								} as React.CSSProperties
							}
						>
							<table
								className="w-full min-w-[1200px]"
								style={{ tableLayout: "fixed" }}
							>
								<tbody
									style={{
										height: `${rowVirtualizer.getTotalSize()}px`,
										position: "relative",
										display: "block",
									}}
								>
									{virtualItems.map((virtualRow) => {
										const row = webset.WebsetRows[virtualRow.index];
										const person = row.originalData as PersonData;
										return (
											<tr
												key={virtualRow.key}
												style={{
													position: "absolute",
													top: `${virtualRow.start}px`,
													left: 0,
													right: 0,
													height: `${virtualRow.size}px`,
													display: "table",
													width: "100%",
													tableLayout: "fixed",
												}}
												className={`border-b hover:bg-muted/30 ${
													virtualRow.index % 2 === 0
														? "bg-background"
														: "bg-muted/10"
												}`}
											>
												{selectedColumns.map((column) => {
													const value = person?.[column];
													return (
														<td
															key={column}
															className="p-3 overflow-hidden"
															style={{ width: "200px", minWidth: "200px" }}
														>
															<FormatFieldValue
																value={value}
																fieldName={column}
															/>
														</td>
													);
												})}
												{webset.validationCriterias.map(
													(criteria: string, idx: number) => (
														<td
															key={`${row.id}-${criteria}-${idx}`}
															className="p-3 text-center overflow-hidden"
															style={{ width: "150px", minWidth: "150px" }}
														>
															<ValidationStatusCell
																validationResult={row.validationData[idx]}
															/>
														</td>
													),
												)}
												<td
													className="p-3 overflow-hidden"
													style={{ width: "200px", minWidth: "200px" }}
												>
													{row.enrichmentData.length === 0 ? (
														<span className="text-xs text-muted-foreground">
															Pending
														</span>
													) : (
														<Tooltip>
															<TooltipTrigger asChild>
																<div className="flex items-center gap-1 cursor-help">
																	{row.enrichmentData
																		.slice(0, 2)
																		.map(
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
																	{row.enrichmentData.length > 2 && (
																		<Badge
																			variant="outline"
																			className="text-xs"
																		>
																			+{row.enrichmentData.length - 2}
																		</Badge>
																	)}
																</div>
															</TooltipTrigger>
															<TooltipContent side="top" sideOffset={8}>
																<div className="max-w-xs">
																	<p className="font-medium mb-1">
																		All enrichments:
																	</p>
																	<div className="flex flex-wrap gap-1">
																		{row.enrichmentData.map(
																			(enrichment: string, index: number) => (
																				<Badge
																					key={`tooltip-${row.id}-enrichment-${index}`}
																					variant="outline"
																					className="text-xs"
																				>
																					{enrichment}
																				</Badge>
																			),
																		)}
																	</div>
																</div>
															</TooltipContent>
														</Tooltip>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</section>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
