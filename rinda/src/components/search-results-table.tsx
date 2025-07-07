"use client";

import { Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
	id: string;
	name: string;
	profileImage?: string;
	position: string;
	company: string;
	criteria: string[];
	criteriaMet: {
		currentlyEmployed?: boolean;
		location?: boolean;
		overseasCompany?: boolean;
	};
}

const mockResults: SearchResult[] = [
	{
		id: "1",
		name: "Emilyn Daza",
		profileImage: "",
		position: "Senior Web Developer",
		company: "TechCorp Solutions",
		criteria: [
			"Currently Employed",
			"Located in Imus, Cavite",
			"Employed by overseas company",
		],
		criteriaMet: {
			currentlyEmployed: true,
			location: true,
			overseasCompany: true,
		},
	},
	{
		id: "2",
		name: "Juan Dela Cruz",
		profileImage: "",
		position: "Full Stack Developer",
		company: "Global Tech Inc",
		criteria: ["Currently Employed", "Located in Imus, Cavite"],
		criteriaMet: {
			currentlyEmployed: true,
			location: true,
			overseasCompany: false,
		},
	},
	{
		id: "3",
		name: "Maria Santos",
		profileImage: "",
		position: "Frontend Developer",
		company: "Remote Works Ltd",
		criteria: ["Currently Employed", "Employed by overseas company"],
		criteriaMet: {
			currentlyEmployed: true,
			location: false,
			overseasCompany: true,
		},
	},
];

const criteriaColors = {
	"Currently Employed": "bg-purple-100 text-purple-800",
	"Located in Imus, Cavite": "bg-orange-100 text-orange-800",
	"Employed by overseas company": "bg-blue-100 text-blue-800",
};

export function SearchResultsTable() {
	return (
		<div className="bg-background border rounded-lg overflow-hidden">
			<div className="p-4 border-b">
				<h2 className="text-lg font-semibold">Preview search</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Showing sample results based on your criteria
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-muted/50 border-b">
						<tr>
							<th className="text-left p-3 font-medium">Name</th>
							<th className="text-left p-3 font-medium">Position</th>
							<th className="text-left p-3 font-medium">URL</th>
							<th className="text-left p-3 font-medium">Criteria</th>
						</tr>
					</thead>
					<tbody>
						{mockResults.map((result) => (
							<tr key={result.id} className="border-b hover:bg-muted/30">
								<td className="p-3">
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={result.profileImage}
												alt={result.name}
											/>
											<AvatarFallback>
												{result.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium">{result.name}</span>
									</div>
								</td>
								<td className="p-3">
									<div>
										<p className="font-medium">{result.position}</p>
										<p className="text-sm text-muted-foreground">
											{result.company}
										</p>
									</div>
								</td>
								<td className="p-3">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Lock className="h-4 w-4" />
										<span className="text-sm italic">
											Start search to get full results
										</span>
									</div>
								</td>
								<td className="p-3">
									<div className="flex flex-wrap gap-1">
										{result.criteria.map((criterion, idx) => (
											<Badge
												key={idx}
												variant="secondary"
												className={
													criteriaColors[
														criterion as keyof typeof criteriaColors
													] || ""
												}
											>
												{criterion}
											</Badge>
										))}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
