import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function WebsetListSkeleton() {
	const widths = ["75%", "90%", "65%", "85%", "70%", "95%"];

	return (
		<div className="space-y-1">
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={`webset-skeleton-item-${index.toString()}`}
					className="w-full flex items-center gap-2 px-3 py-2 rounded-md"
				>
					<ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-foreground/20" />
					<Skeleton className="h-4 flex-1" style={{ width: widths[index] }} />
				</div>
			))}
		</div>
	);
}
