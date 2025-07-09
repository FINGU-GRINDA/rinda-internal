import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PartialLoadingSkeletonProps {
	webset: {
		searchQuery: string;
		validationCriterias: string[];
		updatedAt: string | Date;
	};
	selectedColumns: string[];
}

const criteriaColors = [
	"bg-purple-100 text-purple-800",
	"bg-blue-100 text-blue-800",
	"bg-green-100 text-green-800",
	"bg-orange-100 text-orange-800",
	"bg-red-100 text-red-800",
];

const getFieldLabel = (fieldName: string): string => {
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

	return (
		FIELD_LABELS[fieldName] ||
		fieldName
			.replace(/_/g, " ")
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim()
	);
};

export function PartialLoadingSkeleton({
	webset,
	selectedColumns,
}: PartialLoadingSkeletonProps) {
	const skeletonRows = 6;

	return (
		<div className="bg-background border rounded-lg overflow-hidden w-full h-full flex flex-col">
			{/* Real header with webset info */}
			<div className="p-4 border-b flex-shrink-0">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Search Results</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Query: "{webset.searchQuery}"
						</p>
					</div>
					<div className="flex items-center gap-4">
						<Skeleton className="h-9 w-32" />
						<div className="text-right">
							<p className="text-sm font-medium">Loading results...</p>
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

			{/* Skeleton table with proper structure */}
			<div className="overflow-x-auto overflow-y-auto flex-1">
				<table className="w-full min-w-[1200px] h-full">
					<thead className="bg-muted/50 border-b sticky top-0">
						<tr>
							{/* Real column headers based on selected columns */}
							{selectedColumns.map((column) => (
								<th
									key={column}
									className="text-left p-3 font-medium min-w-[150px]"
								>
									{getFieldLabel(column)}
								</th>
							))}
							{/* Real validation headers */}
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
							{/* Real enrichment header */}
							<th className="text-left p-3 font-medium">Enrichment</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: skeletonRows }, (_, rowIndex) => (
							<tr
								key={`partial-skeleton-row-${rowIndex.toString()}`}
								className="border-b h-12"
							>
								{/* Data column skeletons */}
								{selectedColumns.map((column, colIndex) => {
									const widthOptions = ["65%", "80%", "70%", "90%", "75%"];
									const width =
										widthOptions[(rowIndex + colIndex) % widthOptions.length];
									return (
										<td
											key={`partial-skeleton-cell-r${rowIndex.toString()}-c${colIndex.toString()}`}
											className="p-3 min-w-[150px] max-w-[200px] overflow-hidden"
										>
											<Skeleton className="h-4" style={{ width }} />
										</td>
									);
								})}
								{/* Validation column skeletons */}
								{webset.validationCriterias.map((_, valIndex) => (
									<td
										key={`partial-skeleton-validation-r${rowIndex.toString()}-v${valIndex.toString()}`}
										className="p-3 text-center overflow-hidden"
									>
										<div className="flex items-center justify-center gap-1">
											<Skeleton className="h-4 w-4 rounded-full" />
											<Skeleton className="h-3 w-12" />
										</div>
									</td>
								))}
								{/* Enrichment column skeleton */}
								<td className="p-3 max-w-[200px] overflow-hidden">
									<Skeleton className="h-5 w-16 rounded-full" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
