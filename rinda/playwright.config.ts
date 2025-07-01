import { defineConfig, devices } from "@playwright/test";
import path from "path";

const isCI = !!process.env.CI;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: !isCI,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	workers: isCI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
	],

	webServer: [
		{
			command: "npm run dev:server",
			port: 3000,
			reuseExistingServer: !isCI,
			env: {
				NODE_ENV: "test",
				DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
			},
		},
		{
			command: "npm run dev:web",
			port: 3001,
			reuseExistingServer: !isCI,
			env: {
				NODE_ENV: "test",
				NEXT_PUBLIC_SERVER_URL: "http://localhost:3000",
			},
		},
	],

	outputDir: "test-results/",
});