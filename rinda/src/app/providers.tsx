"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";

export function Providers(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</NuqsAdapter>
	);
}
