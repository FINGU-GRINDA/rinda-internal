"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Clock, ExternalLink, User, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import type { ValidationStatus } from "../../generated/prisma";

interface WebsetResultsTableProps {
	websetId: string;
}

interface PersonData {
	name?: string;
	position?: string;
	company?: string;
	linkedinUrl?: string;
	profileImage?: string;
	location?: string;
	[key: string]: any;
}

export function WebsetResultsTable({ websetId }: WebsetResultsTableProps) {
	const {
		data: webset,
		isLoading,
		error,
	} = useQuery(
		orpc.webset.liveQuery.experimental_liveOptions({
			input: { id: websetId },
		}),
	);

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
		<div className="bg-background border rounded-lg overflow-hidden">
			<div className="p-4 border-b">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold">Search Results</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Query: "{webset.searchQuery}"
						</p>
					</div>
					<div className="text-right">
						<p className="text-sm font-medium">
							{webset.WebsetRows.length} results
						</p>
						<p className="text-xs text-muted-foreground">
							Updated: {new Date(webset.updatedAt).toLocaleString()}
						</p>
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
				<div className="overflow-x-auto">
					<table className="w-full min-w-[800px]">
						<thead className="bg-muted/50 border-b">
							<tr>
								<th className="text-left p-3 font-medium">Person</th>
								<th className="text-left p-3 font-medium">Position</th>
								<th className="text-left p-3 font-medium">Company</th>
								<th className="text-left p-3 font-medium">Location</th>
								<th className="text-left p-3 font-medium">LinkedIn</th>
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
								const name = person?.name || "Unknown";
								const position = person?.position || person?.title || "N/A";
								const company = person?.company || "N/A";
								const location = person?.location || "N/A";
								const linkedinUrl = person?.linkedinUrl || person?.linkedin_url;

								return (
									<tr key={row.id} className="border-b hover:bg-muted/30">
										<td className="p-3">
											<div className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage src={person?.profileImage} alt={name} />
													<AvatarFallback>
														{name
															.split(" ")
															.map((n) => n[0])
															.join("")
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium">{name}</span>
											</div>
										</td>
										<td className="p-3">
											<span className="text-sm">{position}</span>
										</td>
										<td className="p-3">
											<span className="text-sm">{company}</span>
										</td>
										<td className="p-3">
											<span className="text-sm">{location}</span>
										</td>
										<td className="p-3">
											{linkedinUrl ? (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
													asChild
												>
													<a
														href={`https://${linkedinUrl}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLink className="h-4 w-4" />
													</a>
												</Button>
											) : (
												<span className="text-sm text-muted-foreground">
													N/A
												</span>
											)}
										</td>
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
				</div>
			)}
		</div>
	);
}
