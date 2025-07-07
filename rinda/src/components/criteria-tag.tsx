import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CriteriaTagProps {
	children: React.ReactNode;
	color?: "purple" | "orange" | "blue" | "green";
	onRemove?: () => void;
}

const colorClasses = {
	purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
	orange: "bg-orange-100 text-orange-800 hover:bg-orange-200",
	blue: "bg-blue-100 text-blue-800 hover:bg-blue-200",
	green: "bg-green-100 text-green-800 hover:bg-green-200",
};

export function CriteriaTag({
	children,
	color = "blue",
	onRemove,
}: CriteriaTagProps) {
	return (
		<Badge variant="secondary" className={`${colorClasses[color]} pr-1 gap-1`}>
			{children}
			{onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 hover:bg-black/10 rounded p-0.5"
				>
					<X className="h-3 w-3" />
				</button>
			)}
		</Badge>
	);
}
