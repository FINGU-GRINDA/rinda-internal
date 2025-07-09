import { test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";
const credentialsPath = path.join(__dirname, ".credentials.json");

setup("authenticate", async ({ page }) => {
	// Check if credentials file exists
	if (!fs.existsSync(credentialsPath)) {
		throw new Error(
			"Credentials file not found. Please create tests/.credentials.json with your Google credentials."
		);
	}

	const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

	// Go to login page
	await page.goto("/auth/signin");

	// Click Google OAuth button
	await page.getByRole("button", { name: /sign in with google/i }).click();

	// Handle Google OAuth flow
	await page.waitForURL(/accounts\.google\.com/);
	
	// Enter email
	await page.fill('input[type="email"]', credentials.google.email);
	await page.getByRole("button", { name: /next/i }).click();

	// Enter password
	await page.waitForSelector('input[type="password"]', { state: "visible" });
	await page.fill('input[type="password"]', credentials.google.password);
	await page.getByRole("button", { name: /next/i }).click();

	// Wait for redirect back to application
	await page.waitForURL("http://localhost:3000/**", {
		timeout: 30000,
	});

	// Save signed-in state
	await page.context().storageState({ path: authFile });
});