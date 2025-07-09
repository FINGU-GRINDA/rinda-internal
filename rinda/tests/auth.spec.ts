import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";

// Load credentials from the secure file
const credentialsPath = path.join(__dirname, ".credentials.json");
let credentials: any = {};

// Only load credentials if file exists
if (fs.existsSync(credentialsPath)) {
	credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
} else {
	console.warn("Credentials file not found. Please create tests/.credentials.json");
}

test.describe("Google OAuth Authentication", () => {
	test.use({ storageState: { cookies: [], origins: [] } }); // Start with clean state

	test("should login with Google OAuth", async ({ page, context }) => {
		// Navigate to the login page
		await page.goto("http://localhost:3000/auth/signin");

		// Click on Google login button
		await page.getByRole("button", { name: /sign in with google/i }).click();

		// Wait for Google OAuth page to load
		await page.waitForURL(/accounts\.google\.com/);

		// Enter email
		await page.fill('input[type="email"]', credentials.google.email);
		await page.getByRole("button", { name: /next/i }).click();

		// Wait for password field and enter password
		await page.waitForSelector('input[type="password"]', { state: "visible" });
		await page.fill('input[type="password"]', credentials.google.password);
		await page.getByRole("button", { name: /next/i }).click();

		// Handle potential 2FA or additional security steps if needed
		// This part may need adjustment based on your Google account settings

		// Wait for redirect back to your application
		await page.waitForURL("http://localhost:3000/**", {
			timeout: 30000,
		});

		// Verify successful login - adjust based on your app's behavior
		// For example, check for a user menu or dashboard element
		await expect(page.getByRole("navigation")).toBeVisible();
		
		// Save authentication state for reuse in other tests
		await context.storageState({ path: "playwright/.auth/user.json" });
	});
});

test.describe("Authenticated User Tests", () => {
	// Use saved authentication state
	test.use({ storageState: "playwright/.auth/user.json" });

	test("should access dashboard after login", async ({ page }) => {
		await page.goto("http://localhost:3000/dashboard");
		
		// Verify we're on the dashboard and not redirected to login
		await expect(page).toHaveURL(/\/dashboard/);
		
		// Add more assertions based on your dashboard content
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	});

	test("should maintain session across page navigation", async ({ page }) => {
		await page.goto("http://localhost:3000/dashboard");
		
		// Navigate to another protected route
		await page.goto("http://localhost:3000/dashboard/websets");
		
		// Verify we're still authenticated
		await expect(page).toHaveURL(/\/dashboard\/websets/);
	});
});