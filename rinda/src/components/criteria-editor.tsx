"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CriteriaItem {
	text: string;
	color: "purple" | "orange" | "blue" | "green";
}

interface CriteriaEditorProps {
	onAdd: (criteria: CriteriaItem) => void;
	onCancel: () => void;
}

export function CriteriaEditor({ onAdd, onCancel }: CriteriaEditorProps) {
	const [text, setText] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (text.trim()) {
			onAdd({ text: text.trim(), color: "blue" });
			setText("");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50"
		>
			<Input
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Enter criteria..."
				className="flex-1"
				autoFocus
			/>
			<Button type="submit" size="sm" disabled={!text.trim()}>
				<Plus className="h-4 w-4" />
			</Button>
			<Button type="button" variant="ghost" size="sm" onClick={onCancel}>
				<X className="h-4 w-4" />
			</Button>
		</form>
	);
}
