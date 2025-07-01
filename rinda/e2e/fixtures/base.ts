import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export interface TestFixtures {
	authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
	authenticatedPage: async ({ page }, use) => {
		// Navigate to login page
		await page.goto("/login");
		
		// Perform login with test user
		await page.fill('input[name="email"]', "test@example.com");
		await page.fill('input[name="password"]', "testpassword123");
		await page.click('button[type="submit"]');
		
		// Wait for redirect to dashboard
		await page.waitForURL("/dashboard");
		
		// Use the authenticated page
		await use(page);
	},
});

export { expect };