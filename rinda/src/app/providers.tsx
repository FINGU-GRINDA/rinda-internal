"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";
import { createQueryClient } from "@/lib/query/client";

export function Providers(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => createQueryClient());

	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</NuqsAdapter>
	);
}
