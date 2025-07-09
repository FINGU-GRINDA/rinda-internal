"use client";

import type { JsonValue } from "@prisma/client/runtime/library";
import { Columns, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WebsetRow {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	originalData: JsonValue;
	validationData: ("VALID" | "INVALID" | "PENDING")[];
	enrichmentData: string[];
	websetId: string | null;
}

interface ColumnSelectorProps {
	availableFields: WebsetRow[];
	selectedColumns: string[];
	onColumnsChange: (columns: string[]) => void;
	defaultColumns: string[];
}

const FIELD_GROUPS: Record<string, { label: string; fields: string[] }> = {
	personal: {
		label: "Personal Information",
		fields: [
			"name",
			"firstName",
			"first_name",
			"lastName",
			"last_name",
			"fullName",
			"full_name",
			"headline",
			"summary",
			"about",
			"profileImage",
			"profile_image",
			"gender",
			"birth_date",
			"birth_year",
			"age",
		],
	},
	professional: {
		label: "Professional Information",
		fields: [
			"position",
			"title",
			"jobTitle",
			"job_title",
			"currentPosition",
			"current_position",
			"experience",
			"years_experience",
			"skills",
			"industry",
			"sub_role",
			"salary",
			"inferred_salary",
		],
	},
	company: {
		label: "Company Information",
		fields: [
			"company",
			"currentCompany",
			"current_company",
			"employer",
			"organization",
			"companySize",
			"company_size",
			"companyType",
			"company_type",
		],
	},
	location: {
		label: "Location Information",
		fields: [
			"location",
			"city",
			"state",
			"country",
			"region",
			"address",
			"geoLocation",
			"geo_location",
			"location_country",
			"location_continent",
			"countries",
		],
	},
	contact: {
		label: "Contact Information",
		fields: ["email", "emails", "phone", "mobile", "phone_numbers", "contact"],
	},
	social: {
		label: "Social Media & Links",
		fields: [
			"linkedinUrl",
			"linkedin_url",
			"profileUrl",
			"profile_url",
			"website",
			"twitter",
			"github",
			"linkedin_connections",
		],
	},
	other: {
		label: "Additional Information",
		fields: [],
	},
};

const FIELD_LABELS: Record<string, string> = {
	linkedinUrl: "LinkedIn URL",
	linkedin_url: "LinkedIn URL",
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

export function ColumnSelector({
	availableFields,
	selectedColumns,
	onColumnsChange,
	defaultColumns,
}: ColumnSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);

	// Extract all unique fields from the data
	const allAvailableFields = useMemo(() => {
		const fieldSet = new Set<string>();
		availableFields.forEach((row) => {
			if (
				row.originalData &&
				typeof row.originalData === "object" &&
				!Array.isArray(row.originalData)
			) {
				Object.keys(row.originalData as Record<string, unknown>).forEach(
					(key) => fieldSet.add(key),
				);
			}
		});
		return Array.from(fieldSet);
	}, [availableFields]);

	// Categorize fields
	const categorizedFields = useMemo(() => {
		const categorized: Record<string, string[]> = {};

		// Initialize categories
		Object.keys(FIELD_GROUPS).forEach((group) => {
			categorized[group] = [];
		});

		// Categorize known fields
		allAvailableFields.forEach((field) => {
			let foundCategory = false;

			// First, check if field is in predefined groups
			for (const [groupKey, group] of Object.entries(FIELD_GROUPS)) {
				if (group.fields.includes(field)) {
					categorized[groupKey].push(field);
					foundCategory = true;
					break;
				}
			}

			// If not found in predefined groups, check for keyword-based categorization
			if (!foundCategory) {
				const fieldLower = field.toLowerCase();

				// Personal information keywords
				if (
					fieldLower.includes("gender") ||
					fieldLower.includes("birth") ||
					fieldLower.includes("age") ||
					(fieldLower.includes("name") && !fieldLower.includes("company"))
				) {
					categorized.personal.push(field);
					foundCategory = true;
				}
				// Professional information keywords
				else if (
					fieldLower.includes("salary") ||
					fieldLower.includes("experience") ||
					fieldLower.includes("role") ||
					fieldLower.includes("skill") ||
					fieldLower.includes("industry") ||
					fieldLower.includes("years")
				) {
					categorized.professional.push(field);
					foundCategory = true;
				}
				// Company information keywords
				else if (fieldLower.includes("company")) {
					categorized.company.push(field);
					foundCategory = true;
				}
				// Location information keywords
				else if (
					fieldLower.includes("location") ||
					fieldLower.includes("country") ||
					fieldLower.includes("continent") ||
					fieldLower.includes("address") ||
					fieldLower.includes("postal") ||
					fieldLower.includes("city") ||
					fieldLower.includes("state")
				) {
					categorized.location.push(field);
					foundCategory = true;
				}
				// Contact information keywords
				else if (
					fieldLower.includes("email") ||
					fieldLower.includes("phone") ||
					fieldLower.includes("mobile") ||
					fieldLower.includes("contact")
				) {
					categorized.contact.push(field);
					foundCategory = true;
				}
				// Social media & links keywords
				else if (
					fieldLower.includes("url") ||
					fieldLower.includes("linkedin") ||
					fieldLower.includes("twitter") ||
					fieldLower.includes("facebook") ||
					fieldLower.includes("github") ||
					fieldLower.includes("instagram") ||
					fieldLower.includes("social")
				) {
					categorized.social.push(field);
					foundCategory = true;
				}
			}

			// If still not categorized, put in other
			if (!foundCategory) {
				categorized.other.push(field);
			}
		});

		// Remove empty categories
		Object.keys(categorized).forEach((group) => {
			if (categorized[group].length === 0) {
				delete categorized[group];
			}
		});

		return categorized;
	}, [allAvailableFields]);

	// Filter fields based on search
	const filteredCategorizedFields = useMemo(() => {
		if (!searchQuery) return categorizedFields;

		const filtered: Record<string, string[]> = {};
		Object.entries(categorizedFields).forEach(([category, fields]) => {
			const matchingFields = fields.filter(
				(field) =>
					field.toLowerCase().includes(searchQuery.toLowerCase()) ||
					getFieldLabel(field)
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			);
			if (matchingFields.length > 0) {
				filtered[category] = matchingFields;
			}
		});
		return filtered;
	}, [categorizedFields, searchQuery]);

	const handleToggleColumn = (field: string) => {
		if (selectedColumns.includes(field)) {
			onColumnsChange(selectedColumns.filter((col) => col !== field));
		} else {
			onColumnsChange([...selectedColumns, field]);
		}
	};

	const handleSelectAll = (fields: string[]) => {
		const newColumns = new Set(selectedColumns);
		fields.forEach((field) => newColumns.add(field));
		onColumnsChange(Array.from(newColumns));
	};

	const handleClearAll = (fields: string[]) => {
		onColumnsChange(selectedColumns.filter((col) => !fields.includes(col)));
	};

	const handleResetToDefaults = () => {
		onColumnsChange(defaultColumns);
	};

	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	return (
		<div className="relative" ref={dropdownRef}>
			<Button
				variant="outline"
				size="sm"
				className="gap-2"
				onClick={() => setOpen(!open)}
			>
				<Columns className="h-4 w-4" />
				Columns
				<Badge variant="secondary" className="ml-1">
					{selectedColumns.length}
				</Badge>
			</Button>

			{open && (
				<div className="absolute right-0 mt-2 w-80 bg-background border rounded-lg shadow-lg z-50 max-h-[600px] overflow-hidden flex flex-col">
					<div className="p-3 border-b">
						<h3 className="font-medium mb-2">Select Columns</h3>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search columns..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>

					<div className="px-3 py-2 border-b">
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start"
							onClick={handleResetToDefaults}
						>
							Reset to defaults
						</Button>
					</div>

					<div className="overflow-y-auto flex-1 p-3">
						{Object.entries(filteredCategorizedFields).map(
							([category, fields]) => (
								<div key={category} className="mb-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium">
											{FIELD_GROUPS[category as keyof typeof FIELD_GROUPS]
												?.label || category}
										</span>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => handleSelectAll(fields)}
											>
												All
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => handleClearAll(fields)}
											>
												None
											</Button>
										</div>
									</div>
									<div className="space-y-1">
										{fields.map((field) => (
											<label
												key={field}
												className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
											>
												<input
													type="checkbox"
													checked={selectedColumns.includes(field)}
													onChange={() => handleToggleColumn(field)}
													className="rounded border-gray-300"
												/>
												<span className="text-sm">{getFieldLabel(field)}</span>
											</label>
										))}
									</div>
								</div>
							),
						)}

						{Object.keys(filteredCategorizedFields).length === 0 && (
							<div className="p-4 text-center text-sm text-muted-foreground">
								No columns match your search
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
