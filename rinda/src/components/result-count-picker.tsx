"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ResultCountPickerProps {
	value: string;
	onChange: (value: string) => void;
}

export function ResultCountPicker({ value, onChange }: ResultCountPickerProps) {
	const [isCustom, setIsCustom] = useState(false);
	const [customValue, setCustomValue] = useState("");

	const handleSelectChange = (newValue: string) => {
		if (newValue === "custom") {
			setIsCustom(true);
		} else {
			setIsCustom(false);
			onChange(newValue);
		}
	};

	const handleCustomSubmit = () => {
		if (customValue && parseInt(customValue) > 0) {
			onChange(customValue);
			setIsCustom(false);
		}
	};

	if (isCustom) {
		return (
			<div className="flex gap-2">
				<Input
					type="number"
					min="1"
					max="1000"
					value={customValue}
					onChange={(e) => setCustomValue(e.target.value)}
					placeholder="Enter custom count"
					className="w-40"
					onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
				/>
				<Button size="sm" onClick={handleCustomSubmit}>
					Set
				</Button>
				<Button size="sm" variant="outline" onClick={() => setIsCustom(false)}>
					Cancel
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Select value={value} onValueChange={handleSelectChange}>
				<SelectTrigger className="w-32">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="25">25</SelectItem>
					<SelectItem value="100">100</SelectItem>
					<SelectItem value="custom">
						<div className="flex items-center gap-2">
							<Pencil className="h-3 w-3" />
							Custom
						</div>
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
