import "../lib/orpc.server";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Rinda Internal - Lead Finder & Enrichment",
	description:
		"Intuitive lead finder and enrichment platform powered by AI and semantic search",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
