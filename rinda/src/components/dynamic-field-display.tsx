"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DynamicFieldDisplayProps {
	data: Record<string, unknown>;
	excludeFields?: string[];
}

const FIELD_GROUPS = {
	personal: {
		label: "Personal Information",
		fields: [
			"name",
			"firstName",
			"lastName",
			"fullName",
			"headline",
			"summary",
			"about",
		],
	},
	professional: {
		label: "Professional Information",
		fields: [
			"position",
			"title",
			"jobTitle",
			"currentPosition",
			"experience",
			"skills",
			"industry",
		],
	},
	company: {
		label: "Company Information",
		fields: [
			"company",
			"currentCompany",
			"employer",
			"organization",
			"companySize",
			"companyType",
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
		],
	},
	social: {
		label: "Social Media & Links",
		fields: [
			"linkedinUrl",
			"linkedin_url",
			"profileUrl",
			"website",
			"twitter",
			"github",
			"email",
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

const isUrl = (value: string): boolean => {
	try {
		new URL(value.startsWith("http") ? value : `https://${value}`);
		return true;
	} catch {
		return false;
	}
};

const formatFieldValue = (value: unknown): React.ReactNode => {
	if (value === null || value === undefined || value === "") {
		return <span className="text-muted-foreground text-sm">N/A</span>;
	}

	if (Array.isArray(value)) {
		return (
			<div className="flex flex-wrap gap-1">
				{value.map((item, index) => (
					<Badge key={index.toString()} variant="outline" className="text-xs">
						{String(item)}
					</Badge>
				))}
			</div>
		);
	}

	if (typeof value === "object") {
		return (
			<div className="text-sm">
				<pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
					{JSON.stringify(value, null, 2)}
				</pre>
			</div>
		);
	}

	const stringValue = String(value);

	if (isUrl(stringValue)) {
		const url = stringValue.startsWith("http")
			? stringValue
			: `https://${stringValue}`;
		return (
			<Button
				variant="ghost"
				size="sm"
				className="h-auto p-0 text-blue-600 hover:text-blue-800"
				asChild
			>
				<a
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1"
				>
					<span className="text-sm">{stringValue}</span>
					<ExternalLink className="h-3 w-3" />
				</a>
			</Button>
		);
	}

	return <span className="text-sm">{stringValue}</span>;
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

const categorizeFields = (
	data: Record<string, unknown>,
	excludeFields: string[] = [],
) => {
	const categorized: Record<
		string,
		Array<{ key: string; value: unknown }>
	> = {};
	const usedFields = new Set<string>();

	// Initialize all groups
	Object.keys(FIELD_GROUPS).forEach((group) => {
		categorized[group] = [];
	});

	// Categorize known fields
	Object.entries(FIELD_GROUPS).forEach(([groupKey, group]) => {
		group.fields.forEach((field) => {
			if (Object.hasOwn(data, field) && !excludeFields.includes(field)) {
				categorized[groupKey].push({ key: field, value: data[field] });
				usedFields.add(field);
			}
		});
	});

	// Add remaining fields to "other" category
	Object.entries(data).forEach(([key, value]: [string, unknown]) => {
		if (!usedFields.has(key) && !excludeFields.includes(key)) {
			categorized.other.push({ key, value });
		}
	});

	// Remove empty groups
	Object.keys(categorized).forEach((group) => {
		if (categorized[group].length === 0) {
			delete categorized[group];
		}
	});

	return categorized;
};

export function DynamicFieldDisplay({
	data,
	excludeFields = [],
}: DynamicFieldDisplayProps) {
	const categorizedFields = categorizeFields(data, excludeFields);

	if (Object.keys(categorizedFields).length === 0) {
		return (
			<div className="text-center py-4">
				<p className="text-sm text-muted-foreground">
					No additional fields available
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{Object.entries(categorizedFields).map(([groupKey, fields]) => (
				<div key={groupKey} className="border rounded-lg p-4">
					<h4 className="font-medium text-sm mb-3 text-foreground">
						{FIELD_GROUPS[groupKey as keyof typeof FIELD_GROUPS]?.label ||
							"Additional Information"}
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{fields.map(({ key, value }) => (
							<div key={key} className="flex flex-col gap-1">
								<span className="text-xs font-medium text-muted-foreground">
									{getFieldLabel(key)}
								</span>
								{formatFieldValue(value)}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
