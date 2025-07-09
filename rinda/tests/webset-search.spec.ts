import { expect, test } from "@playwright/test";

test.describe("Webset Search Functionality", () => {
	// Use saved authentication state
	test.use({ storageState: "playwright/.auth/user.json" });

	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/dashboard");
	});

	test("should show search suggestions on focus", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Focus on search input
		await searchInput.click();
		
		// Check if suggestions appear
		const suggestions = page.locator('[data-testid="search-suggestions"]');
		await expect(suggestions).toBeVisible({ timeout: 5000 });
		
		// Verify at least one suggestion is shown
		const suggestionItems = suggestions.locator('[data-testid="suggestion-item"]');
		await expect(suggestionItems).toHaveCount(1, { timeout: 5000 });
	});

	test("should navigate to pre-search page on search", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Enter search query
		await searchInput.click();
		await searchInput.fill("data scientists with PhD");
		await searchInput.press("Enter");
		
		// Verify navigation to pre-search page
		await page.waitForURL("**/pre-search**");
		await expect(page.url()).toContain("query=data+scientists+with+PhD");
		
		// Verify query is displayed on the page
		await expect(page.getByText("data scientists with PhD")).toBeVisible();
	});

	test("should generate validation criteria automatically", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Perform search
		await searchInput.click();
		await searchInput.fill("marketing managers in tech companies");
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		
		// Check loading state
		await expect(page.getByText("Generating validation criteria...")).toBeVisible();
		
		// Wait for validation criteria to load
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		
		// Verify validation criteria are displayed
		const criteriaContainer = page.locator('[data-testid="validation-criteria-container"]');
		await expect(criteriaContainer).toBeVisible();
		
		const criteriaItems = criteriaContainer.locator('[data-testid="validation-criteria"]');
		await expect(criteriaItems).toHaveCount(1, { timeout: 10000 });
		
		// Verify each criteria has expected structure
		const firstCriteria = criteriaItems.first();
		await expect(firstCriteria).toContainText(/marketing|manager|tech/i);
	});

	test("should show preview results on pre-search page", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Perform search
		await searchInput.click();
		await searchInput.fill("sales executives in SaaS");
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		
		// Wait for preview results to load
		const previewResults = page.locator('[data-testid="preview-results"]');
		await expect(previewResults).toBeVisible({ timeout: 15000 });
		
		// Verify at least one result is shown
		const resultItems = previewResults.locator('[data-testid="preview-result-item"]');
		await expect(resultItems.first()).toBeVisible({ timeout: 10000 });
		
		// Check result structure
		const firstResult = resultItems.first();
		await expect(firstResult.locator('[data-testid="result-name"]')).toBeVisible();
		await expect(firstResult.locator('[data-testid="result-title"]')).toBeVisible();
	});

	test("should allow editing validation criteria", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Perform search
		await searchInput.click();
		await searchInput.fill("frontend developers with React experience");
		await searchInput.press("Enter");
		
		// Wait for pre-search page and criteria to load
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		
		// Find edit button for criteria
		const criteriaItem = page.locator('[data-testid="validation-criteria"]').first();
		const editButton = criteriaItem.locator('[data-testid="edit-criteria"]');
		
		if (await editButton.isVisible()) {
			await editButton.click();
			
			// Edit the criteria
			const editInput = criteriaItem.locator('input, textarea');
			await editInput.clear();
			await editInput.fill("Must have 5+ years of React experience");
			
			// Save the edit
			const saveButton = criteriaItem.locator('[data-testid="save-criteria"]');
			await saveButton.click();
			
			// Verify the updated criteria is displayed
			await expect(criteriaItem).toContainText("Must have 5+ years of React experience");
		}
	});

	test("should handle empty search query", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Try to search with empty query
		await searchInput.click();
		await searchInput.press("Enter");
		
		// Should stay on dashboard or show validation error
		await expect(page).toHaveURL("http://localhost:3000/dashboard");
		
		// Or check for validation message
		const validationMessage = page.locator('[data-testid="search-validation-error"]');
		if (await validationMessage.isVisible({ timeout: 2000 })) {
			await expect(validationMessage).toContainText(/enter.*query/i);
		}
	});

	test("should preserve search state on browser back", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Perform search
		await searchInput.click();
		await searchInput.fill("backend engineers with Python");
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText("backend engineers with Python")).toBeVisible();
		
		// Navigate to another page
		await page.getByRole("button", { name: /create webset/i }).click();
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		
		// Go back
		await page.goBack();
		
		// Verify search state is preserved
		await expect(page).toHaveURL(/pre-search.*query=backend\+engineers\+with\+Python/);
		await expect(page.getByText("backend engineers with Python")).toBeVisible();
	});

	test("should handle special characters in search query", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Search with special characters
		await searchInput.click();
		await searchInput.fill('engineers with "machine learning" & AI/ML experience');
		await searchInput.press("Enter");
		
		// Verify navigation and encoding
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText('engineers with "machine learning" & AI/ML experience')).toBeVisible();
		
		// Verify the query is properly handled
		await expect(page.getByText("Generating validation criteria...")).toBeVisible();
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
	});

	test("should show loading states appropriately", async ({ page }) => {
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		
		// Perform search
		await searchInput.click();
		await searchInput.fill("DevOps engineers with Kubernetes");
		await searchInput.press("Enter");
		
		// Wait for pre-search page
		await page.waitForURL("**/pre-search**");
		
		// Check for loading indicators
		const loadingIndicators = [
			page.getByText("Generating validation criteria..."),
			page.getByText("Loading preview results..."),
			page.locator('[data-testid="loading-spinner"]')
		];
		
		// At least one loading indicator should be visible
		let loadingVisible = false;
		for (const indicator of loadingIndicators) {
			if (await indicator.isVisible({ timeout: 2000 })) {
				loadingVisible = true;
				break;
			}
		}
		expect(loadingVisible).toBeTruthy();
		
		// Eventually all loading states should disappear
		for (const indicator of loadingIndicators) {
			if (await indicator.isVisible({ timeout: 1000 })) {
				await expect(indicator).toBeHidden({ timeout: 30000 });
			}
		}
	});
});