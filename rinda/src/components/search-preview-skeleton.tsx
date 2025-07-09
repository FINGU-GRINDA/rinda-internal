import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchPreviewSkeletonProps {
	fields?: number;
	rows?: number;
}

export function SearchPreviewSkeleton({
	fields = 6,
	rows = 5,
}: SearchPreviewSkeletonProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isPanning, setIsPanning] = useState(false);
	const [panStart, setPanStart] = useState({ x: 0, y: 0 });
	const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

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

	return (
		<div className="bg-background border rounded-lg overflow-hidden h-full flex flex-col">
			{/* Header skeleton */}
			<div className="p-4 border-b flex-shrink-0">
				<Skeleton className="h-6 w-32 mb-2" />
				<Skeleton className="h-4 w-56" />
			</div>

			{/* Table skeleton */}
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
							{Array.from({ length: fields }, (_, i) => (
								<th
									key={`header-skeleton-${i.toString()}`}
									className="text-left p-3 font-medium whitespace-nowrap min-w-[150px]"
								>
									<Skeleton className="h-4 w-24" />
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: rows }, (_, rowIndex) => (
							<tr
								key={`preview-skeleton-row-${rowIndex.toString()}`}
								className="border-b"
							>
								{Array.from({ length: fields }, (_, colIndex) => {
									const widthOptions = ["w-20", "w-32", "w-24", "w-40", "w-28"];
									const width = widthOptions[colIndex % widthOptions.length];
									return (
										<td
											key={`preview-skeleton-cell-${rowIndex.toString()}-${colIndex.toString()}`}
											className="p-3 whitespace-nowrap"
										>
											<div className="max-w-xs">
												<Skeleton className={`h-4 ${width}`} />
											</div>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}
