import { ClipLoader } from "react-spinners";

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="flex flex-col items-center gap-4">
				<ClipLoader color="#6366f1" size={40} speedMultiplier={0.8} />
				<p className="text-sm text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
