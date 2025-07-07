"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface EnrichmentOption {
	id: string;
	label: string;
	checked: boolean;
}

interface EnrichmentToggleProps {
	enrichments: EnrichmentOption[];
	onToggle: (id: string) => void;
}

export function EnrichmentToggle({
	enrichments,
	onToggle,
}: EnrichmentToggleProps) {
	return (
		<div className="space-y-3">
			{enrichments.map((enrichment) => (
				<div key={enrichment.id} className="flex items-center justify-between">
					<Label
						htmlFor={enrichment.id}
						className="text-sm font-normal cursor-pointer"
					>
						{enrichment.label}
					</Label>
					<Switch
						id={enrichment.id}
						checked={enrichment.checked}
						onCheckedChange={() => onToggle(enrichment.id)}
					/>
				</div>
			))}
		</div>
	);
}
