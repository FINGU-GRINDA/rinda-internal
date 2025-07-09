import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
	columns?: number;
	rows?: number;
	showValidation?: boolean;
	validationColumns?: number;
}

export function TableSkeleton({
	columns = 5,
	rows = 6,
	showValidation = true,
	validationColumns = 2,
}: TableSkeletonProps) {
	return (
		<div className="bg-background border rounded-lg overflow-hidden w-full h-full flex flex-col">
			{/* Header skeleton */}
			<div className="p-4 border-b flex-shrink-0">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex items-center gap-4">
						<Skeleton className="h-9 w-32" />
						<div className="text-right space-y-1">
							<Skeleton className="h-4 w-20 ml-auto" />
							<Skeleton className="h-3 w-28" />
						</div>
					</div>
				</div>
				{showValidation && (
					<div className="mt-3">
						<Skeleton className="h-4 w-32 mb-2" />
						<div className="flex gap-1">
							{Array.from({ length: validationColumns }, (_, i) => (
								<Skeleton
									key={`validation-badge-${i.toString()}`}
									className="h-6 w-24 rounded-full"
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Table skeleton */}
			<div className="overflow-x-auto overflow-y-auto flex-1">
				<table className="w-full min-w-[1200px] h-full">
					<thead className="bg-muted/50 border-b sticky top-0">
						<tr>
							{/* Column headers */}
							{Array.from({ length: columns }, (_, i) => (
								<th
									key={`column-header-${i.toString()}`}
									className="text-left p-3"
								>
									<Skeleton className="h-4 w-24" />
								</th>
							))}
							{/* Validation headers */}
							{showValidation &&
								Array.from({ length: validationColumns }, (_, i) => (
									<th
										key={`validation-col-header-${i.toString()}`}
										className="text-left p-3"
									>
										<Skeleton className="h-4 w-20" />
									</th>
								))}
							{/* Enrichment header */}
							<th className="text-left p-3">
								<Skeleton className="h-4 w-24" />
							</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: rows }, (_, rowIndex) => (
							<tr
								key={`skeleton-row-${rowIndex.toString()}`}
								className="border-b"
							>
								{/* Data columns */}
								{Array.from({ length: columns }, (_, colIndex) => {
									const widthOptions = ["65%", "80%", "70%", "90%", "75%"];
									const width =
										widthOptions[(rowIndex + colIndex) % widthOptions.length];
									return (
										<td
											key={`skeleton-cell-r${rowIndex.toString()}-c${colIndex.toString()}`}
											className="p-3"
										>
											<Skeleton className="h-4" style={{ width }} />
										</td>
									);
								})}
								{/* Validation columns */}
								{showValidation &&
									Array.from({ length: validationColumns }, (_, valIndex) => (
										<td
											key={`skeleton-validation-r${rowIndex.toString()}-v${valIndex.toString()}`}
											className="p-3 text-center"
										>
											<div className="flex items-center justify-center gap-1">
												<Skeleton className="h-4 w-4 rounded-full" />
												<Skeleton className="h-3 w-12" />
											</div>
										</td>
									))}
								{/* Enrichment column */}
								<td className="p-3">
									<Skeleton className="h-6 w-16 rounded-full" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
