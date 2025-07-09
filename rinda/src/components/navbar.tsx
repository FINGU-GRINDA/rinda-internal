"use client";

import { User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
	const { data: session, isPending } = authClient.useSession();

	return (
		<nav className="fixed top-0 right-0 left-64 h-16 border-b bg-background flex items-center justify-end px-6 z-10">
			<div className="flex items-center gap-4">
				<ThemeToggle />
				<Avatar className="h-8 w-8 cursor-pointer">
					<AvatarImage
						src={session?.user?.image || ""}
						alt={session?.user?.name || "User"}
					/>
					<AvatarFallback>
						{isPending ? (
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
						) : (
							<User className="h-4 w-4" />
						)}
					</AvatarFallback>
				</Avatar>
			</div>
		</nav>
	);
}
