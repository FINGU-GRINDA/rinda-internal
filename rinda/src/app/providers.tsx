"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { createQueryClient } from "@/lib/query/client";

export function Providers(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => createQueryClient());

	return (
		<NuqsAdapter>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{props.children}
				</ThemeProvider>
			</QueryClientProvider>
		</NuqsAdapter>
	);
}
