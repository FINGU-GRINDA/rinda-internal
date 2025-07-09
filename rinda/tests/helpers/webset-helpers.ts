import { Page, expect } from "@playwright/test";

export interface WebsetTestData {
	query: string;
	validationCriterias?: string[];
	enrichmentCriterias?: string[];
	count?: number;
}

export interface WebsetResult {
	id: string;
	url: string;
}

/**
 * Creates a new webset through the UI flow
 * @param page - Playwright page object
 * @param data - Webset creation data
 * @returns Object containing webset ID and URL
 */
export async function createWebset(page: Page, data: WebsetTestData): Promise<WebsetResult> {
	// Navigate to dashboard
	await page.goto("http://localhost:3000/dashboard");
	
	// Perform search
	const searchInput = page.getByPlaceholder("Search for people, companies, or topics...");
	await searchInput.click();
	await searchInput.fill(data.query);
	await searchInput.press("Enter");
	
	// Wait for pre-search page
	await page.waitForURL("**/pre-search**");
	
	// Wait for validation criteria to generate
	await expect(page.getByText("Generating validation criteria...")).toBeVisible();
	await expect(page.getByText("Generating validation criteria...")).toBeHidden({ timeout: 30000 });
	
	// Optionally edit validation criteria if provided
	if (data.validationCriterias && data.validationCriterias.length > 0) {
		// Implementation would depend on UI for editing criteria
		// This is a placeholder for future implementation
	}
	
	// Create webset
	await page.getByRole("button", { name: /create webset/i }).click();
	
	// Wait for redirect to webset page
	await page.waitForURL(/\/dashboard\/websets\/[a-zA-Z0-9-]+$/);
	
	const url = page.url();
	const id = url.split("/").pop() || "";
	
	return { id, url };
}

/**
 * Waits for webset results to finish loading
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait in milliseconds
 */
export async function waitForWebsetResults(page: Page, timeout: number = 30000): Promise<void> {
	// Wait for loading indicator to disappear
	const loadingIndicator = page.getByText("Loading search results...");
	if (await loadingIndicator.isVisible({ timeout: 1000 })) {
		await expect(loadingIndicator).toBeHidden({ timeout });
	}
	
	// Wait for at least one result row
	const resultsTable = page.locator('[data-testid="webset-results-table"]');
	await expect(resultsTable).toBeVisible({ timeout: 5000 });
	
	const rows = resultsTable.locator('tbody tr');
	await expect(rows.first()).toBeVisible({ timeout: 10000 });
}

/**
 * Gets all webset items from the sidebar
 * @param page - Playwright page object
 * @returns Array of webset names
 */
export async function getWebsetsFromSidebar(page: Page): Promise<string[]> {
	const sidebar = page.locator('[data-testid="sidebar"]');
	const websetItems = sidebar.locator('[data-testid="webset-item"]');
	
	const count = await websetItems.count();
	const websets: string[] = [];
	
	for (let i = 0; i < count; i++) {
		const text = await websetItems.nth(i).textContent();
		if (text) {
			websets.push(text);
		}
	}
	
	return websets;
}

/**
 * Searches for websets in the sidebar
 * @param page - Playwright page object
 * @param searchTerm - Term to search for
 */
export async function searchWebsetsInSidebar(page: Page, searchTerm: string): Promise<void> {
	const sidebarSearch = page.locator('[data-testid="sidebar-search"]');
	await sidebarSearch.click();
	await sidebarSearch.fill(searchTerm);
}

/**
 * Gets validation status for a specific result row
 * @param page - Playwright page object
 * @param rowIndex - Index of the row (0-based)
 * @returns Validation status or null if not found
 */
export async function getValidationStatus(page: Page, rowIndex: number): Promise<string | null> {
	const rows = page.locator('tbody tr');
	const row = rows.nth(rowIndex);
	
	const validationCell = row.locator('[data-testid="validation-status"]');
	if (await validationCell.isVisible()) {
		const statusBadge = validationCell.locator('[data-testid="status-badge"]');
		return await statusBadge.textContent();
	}
	
	return null;
}

/**
 * Toggles column visibility in the results table
 * @param page - Playwright page object
 * @param columnName - Name of the column to toggle
 */
export async function toggleTableColumn(page: Page, columnName: string): Promise<void> {
	const columnSelector = page.locator('[data-testid="column-selector"]');
	if (await columnSelector.isVisible()) {
		await columnSelector.click();
		
		// Find and click the column toggle
		const columnDropdown = page.locator('[data-testid="column-dropdown"]');
		await expect(columnDropdown).toBeVisible();
		
		const columnToggle = columnDropdown.locator(`[data-testid="column-toggle"]:has-text("${columnName}")`);
		if (await columnToggle.isVisible()) {
			await columnToggle.click();
		}
		
		// Close dropdown
		await page.keyboard.press("Escape");
	}
}

/**
 * Mock data generator for consistent test data
 */
export const mockWebsetData = {
	searchQueries: [
		"senior software engineers in San Francisco",
		"product managers at startups",
		"data scientists with PhD",
		"marketing managers in tech companies",
		"frontend developers with React experience",
		"DevOps engineers with Kubernetes",
		"sales executives in SaaS",
		"backend engineers with Python"
	],
	
	validationCriterias: [
		"Must have 5+ years of experience",
		"Currently employed at target company",
		"Has relevant skill mentioned in profile",
		"Located in specified geographic area",
		"Has leadership or management experience"
	],
	
	enrichmentCriterias: [
		"LinkedIn profile URL",
		"Current company details",
		"Email address",
		"Phone number",
		"Recent activity or posts"
	]
};

/**
 * Waits for live updates to appear in the webset results
 * @param page - Playwright page object
 * @param initialState - Initial state to compare against
 * @param timeout - Maximum time to wait for updates
 */
export async function waitForLiveUpdates(
	page: Page, 
	initialState: { rowCount: number; validationCount: number },
	timeout: number = 10000
): Promise<boolean> {
	const startTime = Date.now();
	
	while (Date.now() - startTime < timeout) {
		const currentRowCount = await page.locator('tbody tr').count();
		const currentValidationCount = await page.locator('[data-testid="validation-badge"]').count();
		
		if (currentRowCount > initialState.rowCount || 
			currentValidationCount > initialState.validationCount) {
			return true;
		}
		
		await page.waitForTimeout(500);
	}
	
	return false;
}

/**
 * Extracts result data from a specific row
 * @param page - Playwright page object
 * @param rowIndex - Index of the row to extract data from
 */
export async function getResultRowData(page: Page, rowIndex: number): Promise<Record<string, string>> {
	const rows = page.locator('tbody tr');
	const row = rows.nth(rowIndex);
	
	const data: Record<string, string> = {};
	
	// Common fields to extract
	const fields = [
		{ selector: '[data-testid="result-name"]', key: 'name' },
		{ selector: '[data-testid="result-title"]', key: 'title' },
		{ selector: '[data-testid="result-company"]', key: 'company' },
		{ selector: '[data-testid="result-location"]', key: 'location' },
		{ selector: 'a[href*="linkedin.com"]', key: 'linkedinUrl' }
	];
	
	for (const field of fields) {
		const element = row.locator(field.selector);
		if (await element.isVisible()) {
			if (field.key === 'linkedinUrl') {
				data[field.key] = await element.getAttribute('href') || '';
			} else {
				data[field.key] = await element.textContent() || '';
			}
		}
	}
	
	return data;
}