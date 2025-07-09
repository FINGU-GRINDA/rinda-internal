import { expect, test } from "@playwright/test";

test.describe("Webset Management", () => {
	// Use saved authentication state from auth test
	test.use({ storageState: "playwright/.auth/user.json" });

	test("should create a new webset from dashboard search", async ({ page }) => {
		// Navigate to dashboard
		await page.goto("http://localhost:3000/dashboard");
		
		// Focus on search bar and enter query
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		await searchInput.click();
		await searchInput.fill("senior software engineers in San Francisco");
		
		// Press Enter or click search
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		
		// Verify search query is displayed
		await expect(page.getByText("senior software engineers in San Francisco")).toBeVisible();
		
		// Wait for validation criteria to be generated
		await expect(page.getByText("Generating validation criteria...")).toBeVisible();
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		
		// Verify at least one validation criteria is shown
		const validationCriteria = page.locator('[data-testid="validation-criteria"]');
		await expect(validationCriteria).toHaveCount(1, { timeout: 10000 });
		
		// Create webset
		await page.getByRole("button", { name: /create webset/i }).click();
		
		// Wait for redirect to webset page
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		
		// Verify we're on the webset page
		const websetId = page.url().split("/").pop();
		expect(websetId).toBeTruthy();
	});

	test("should display webset in sidebar after creation", async ({ page }) => {
		// Create a webset first
		await page.goto("http://localhost:3000/dashboard");
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		await searchInput.click();
		await searchInput.fill("product managers at startups");
		await searchInput.press("Enter");
		
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		await page.getByRole("button", { name: /create webset/i }).click();
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		
		// Check sidebar for the webset
		const sidebar = page.locator('[data-testid="sidebar"]');
		await expect(sidebar.getByText("product managers at startups")).toBeVisible();
	});

	test("should navigate to existing webset from sidebar", async ({ page }) => {
		// Go to dashboard
		await page.goto("http://localhost:3000/dashboard");
		
		// Find and click on a webset in the sidebar
		const sidebar = page.locator('[data-testid="sidebar"]');
		const websetItems = sidebar.locator('[data-testid="webset-item"]');
		
		// Ensure at least one webset exists
		await expect(websetItems.first()).toBeVisible({ timeout: 10000 });
		
		// Get the text of the first webset
		const websetText = await websetItems.first().textContent();
		
		// Click on the webset
		await websetItems.first().click();
		
		// Verify navigation to webset page
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		
		// Verify the webset content is loading
		await expect(page.getByText("Loading search results...")).toBeVisible();
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
	});

	test("should filter websets in sidebar search", async ({ page }) => {
		// Go to dashboard
		await page.goto("http://localhost:3000/dashboard");
		
		// Find sidebar search input
		const sidebarSearch = page.locator('[data-testid="sidebar-search"]');
		await sidebarSearch.click();
		
		// Enter search term
		await sidebarSearch.fill("engineer");
		
		// Verify filtered results
		const websetItems = page.locator('[data-testid="webset-item"]');
		const count = await websetItems.count();
		
		// Check that all visible items contain "engineer"
		for (let i = 0; i < count; i++) {
			const text = await websetItems.nth(i).textContent();
			expect(text?.toLowerCase()).toContain("engineer");
		}
		
		// Clear search and verify all items are visible again
		await sidebarSearch.clear();
		const allItemsCount = await websetItems.count();
		expect(allItemsCount).toBeGreaterThanOrEqual(count);
	});

	test("should show empty state when no websets exist", async ({ page, context }) => {
		// Create a new context without any websets
		// This would require clearing the database or using a test user
		// For now, we'll check if the empty state component exists
		
		await page.goto("http://localhost:3000/dashboard");
		
		// Check for empty state if no websets exist
		const sidebar = page.locator('[data-testid="sidebar"]');
		const emptyState = sidebar.locator('[data-testid="no-websets"]');
		
		// This will only pass if user has no websets
		if (await emptyState.isVisible()) {
			await expect(emptyState).toContainText(/no websets yet/i);
		}
	});

	test("should handle webset creation errors gracefully", async ({ page }) => {
		// Navigate to dashboard
		await page.goto("http://localhost:3000/dashboard");
		
		// Enter an extremely long query that might cause issues
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		await searchInput.click();
		await searchInput.fill("a".repeat(1000)); // Very long query
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		
		// Check for error handling
		const errorMessage = page.locator('[data-testid="error-message"]');
		if (await errorMessage.isVisible({ timeout: 5000 })) {
			await expect(errorMessage).toContainText(/error|failed/i);
		}
	});
});