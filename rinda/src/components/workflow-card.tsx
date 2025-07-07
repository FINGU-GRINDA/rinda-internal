import type { LucideIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface WorkflowCardProps {
	title: string;
	subtitle: string;
	description: string;
	icon?: LucideIcon;
	className?: string;
}

export function WorkflowCard({
	title,
	subtitle,
	description,
	icon: Icon,
	className,
}: WorkflowCardProps) {
	return (
		<Card
			className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${className}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-sm font-medium text-muted-foreground mb-1">
							{title}
						</p>
						<CardTitle className="text-lg">{subtitle}</CardTitle>
					</div>
					{Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
				</div>
			</CardHeader>
			<CardContent>
				<CardDescription>{description}</CardDescription>
			</CardContent>
		</Card>
	);
}
