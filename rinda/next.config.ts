import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		authInterrupts: true,
	},
	serverExternalPackages: ["@mastra/*"],
};

export default nextConfig;
