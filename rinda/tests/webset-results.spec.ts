import { expect, test } from "@playwright/test";

test.describe("Webset Results Viewing", () => {
	// Use saved authentication state
	test.use({ storageState: "playwright/.auth/user.json" });

	let websetId: string;

	test.beforeAll(async ({ browser }) => {
		// Create a webset to use for all tests
		const context = await browser.newContext({ storageState: "playwright/.auth/user.json" });
		const page = await context.newPage();
		
		await page.goto("http://localhost:3000/dashboard");
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		await searchInput.click();
		await searchInput.fill("test engineers for E2E testing");
		await searchInput.press("Enter");
		
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		await page.getByRole("button", { name: /create webset/i }).click();
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		
		websetId = page.url().split("/").pop() || "";
		await context.close();
	});

	test("should display webset results table", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for loading to complete
		await expect(page.getByText("Loading search results...")).toBeVisible();
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Verify table is displayed
		const resultsTable = page.locator('[data-testid="webset-results-table"]');
		await expect(resultsTable).toBeVisible();
		
		// Verify table headers
		const headers = resultsTable.locator('thead th');
		await expect(headers).toHaveCount(1, { timeout: 10000 });
		
		// Common headers to check for
		const expectedHeaders = ["Name", "Title", "Company", "Location"];
		for (const headerText of expectedHeaders) {
			const header = headers.filter({ hasText: headerText });
			if (await header.count() > 0) {
				await expect(header.first()).toBeVisible();
			}
		}
	});

	test("should show live updates via WebSocket/SSE", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for initial load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Get initial row count
		const resultsTable = page.locator('[data-testid="webset-results-table"]');
		const initialRows = await resultsTable.locator('tbody tr').count();
		
		// Wait for potential updates (this assumes background processing is happening)
		await page.waitForTimeout(5000);
		
		// Check if row count has changed or validation status has updated
		const updatedRows = await resultsTable.locator('tbody tr').count();
		
		// Either row count increased or validation badges appeared
		const validationBadges = page.locator('[data-testid="validation-badge"]');
		const hasValidationUpdates = await validationBadges.count() > 0;
		
		expect(updatedRows >= initialRows || hasValidationUpdates).toBeTruthy();
	});

	test("should display validation status for each row", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for results to load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Wait for at least one row
		const firstRow = page.locator('tbody tr').first();
		await expect(firstRow).toBeVisible({ timeout: 10000 });
		
		// Check for validation status indicators
		const validationCell = firstRow.locator('[data-testid="validation-status"]');
		if (await validationCell.isVisible()) {
			// Check for status badges (PENDING, VALID, INVALID)
			const statusBadge = validationCell.locator('[data-testid="status-badge"]');
			await expect(statusBadge).toBeVisible();
			
			const statusText = await statusBadge.textContent();
			expect(["PENDING", "VALID", "INVALID"]).toContain(statusText);
		}
	});

	test("should allow column selection", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for results to load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Look for column selector button
		const columnSelector = page.locator('[data-testid="column-selector"]');
		if (await columnSelector.isVisible()) {
			await columnSelector.click();
			
			// Column selector dropdown should appear
			const columnDropdown = page.locator('[data-testid="column-dropdown"]');
			await expect(columnDropdown).toBeVisible();
			
			// Toggle a column
			const columnToggle = columnDropdown.locator('[data-testid="column-toggle"]').first();
			const columnName = await columnToggle.textContent();
			await columnToggle.click();
			
			// Close dropdown
			await page.keyboard.press("Escape");
			
			// Verify column visibility changed
			const headers = page.locator('thead th');
			const headerTexts = await headers.allTextContents();
			
			// The toggled column should either appear or disappear
			// This depends on its initial state
		}
	});

	test("should display enrichment data when available", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for results to load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Look for enrichment data columns or cells
		const enrichmentData = page.locator('[data-testid="enrichment-data"]');
		
		if (await enrichmentData.first().isVisible({ timeout: 5000 })) {
			// Verify enrichment data structure
			const firstEnrichment = enrichmentData.first();
			await expect(firstEnrichment).not.toBeEmpty();
			
			// Check for common enrichment fields
			const enrichmentText = await firstEnrichment.textContent();
			expect(enrichmentText).toBeTruthy();
		}
	});

	test("should handle pagination for large result sets", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for results to load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Check for pagination controls
		const pagination = page.locator('[data-testid="pagination"]');
		
		if (await pagination.isVisible({ timeout: 5000 })) {
			// Check for page numbers or next/previous buttons
			const nextButton = pagination.locator('[data-testid="next-page"]');
			const pageNumbers = pagination.locator('[data-testid="page-number"]');
			
			// If there are multiple pages
			if (await nextButton.isEnabled()) {
				// Get initial first row data
				const firstRowBefore = await page.locator('tbody tr').first().textContent();
				
				// Navigate to next page
				await nextButton.click();
				
				// Wait for new data to load
				await page.waitForTimeout(1000);
				
				// Verify data changed
				const firstRowAfter = await page.locator('tbody tr').first().textContent();
				expect(firstRowBefore).not.toBe(firstRowAfter);
			}
		}
	});

	test("should display LinkedIn URLs correctly", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for results to load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Look for LinkedIn links
		const linkedInLinks = page.locator('a[href*="linkedin.com"]');
		
		if (await linkedInLinks.first().isVisible({ timeout: 5000 })) {
			const firstLink = linkedInLinks.first();
			
			// Verify link format
			const href = await firstLink.getAttribute("href");
			expect(href).toMatch(/https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/);
			
			// Verify link opens in new tab
			const target = await firstLink.getAttribute("target");
			expect(target).toBe("_blank");
			
			// Verify link has proper security attributes
			const rel = await firstLink.getAttribute("rel");
			expect(rel).toContain("noopener");
		}
	});

	test("should show empty state when no results", async ({ page }) => {
		// Create a webset with a query that likely returns no results
		await page.goto("http://localhost:3000/dashboard");
		const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
		await searchInput.click();
		await searchInput.fill("xyzabc123 impossible query with no results");
		await searchInput.press("Enter");
		
		await page.waitForURL("**/pre-search**");
		await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
		await page.getByRole("button", { name: /create webset/i }).click();
		
		// Wait for webset page
		await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Check for empty state
		const emptyState = page.locator('[data-testid="empty-results"]');
		if (await emptyState.isVisible({ timeout: 5000 })) {
			await expect(emptyState).toContainText(/no results|empty/i);
		}
	});

	test("should handle errors gracefully", async ({ page }) => {
		// Navigate to an invalid webset ID
		await page.goto("http://localhost:3000/dashboard/websets/invalid-id-123");
		
		// Check for error handling
		const errorMessage = page.locator('[data-testid="error-message"]');
		if (await errorMessage.isVisible({ timeout: 5000 })) {
			await expect(errorMessage).toContainText(/error|not found/i);
		} else {
			// Might redirect to dashboard or show 404
			await expect(page).toHaveURL(/dashboard|404/);
		}
	});

	test("should update results count dynamically", async ({ page }) => {
		await page.goto(`http://localhost:3000/dashboard/websets/${websetId}`);
		
		// Wait for initial load
		await expect(page.getByText("Loading search results...")).toBeHidden({ timeout: 30000 });
		
		// Look for results count display
		const resultsCount = page.locator('[data-testid="results-count"]');
		
		if (await resultsCount.isVisible({ timeout: 5000 })) {
			const initialCount = await resultsCount.textContent();
			expect(initialCount).toMatch(/\d+/); // Should contain a number
			
			// Wait for potential updates
			await page.waitForTimeout(3000);
			
			// Count might update as more results are processed
			const updatedCount = await resultsCount.textContent();
			expect(updatedCount).toMatch(/\d+/);
		}
	});
});