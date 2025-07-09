export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="flex flex-col items-center gap-4">
				<div className="relative w-10 h-10">
					<div className="absolute inset-0 rounded-full border-4 border-primary/20" />
					<div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
				</div>
				<p className="text-sm text-muted-foreground animate-pulse">
					Loading...
				</p>
			</div>
		</div>
	);
}
