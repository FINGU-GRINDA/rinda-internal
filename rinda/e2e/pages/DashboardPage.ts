import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
	readonly page: Page;
	readonly heading: Locator;
	readonly userEmail: Locator;
	readonly logoutButton: Locator;
	readonly todoLink: Locator;
	readonly aiLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.heading = page.locator("h1");
		this.userEmail = page.locator('text=/@/');
		this.logoutButton = page.locator('button:has-text("Sign out")');
		this.todoLink = page.locator('a[href="/todos"]');
		this.aiLink = page.locator('a[href="/ai"]');
	}

	async goto() {
		await this.page.goto("/dashboard");
	}

	async logout() {
		await this.logoutButton.click();
		await this.page.waitForURL("/");
	}

	async navigateToTodos() {
		await this.todoLink.click();
		await this.page.waitForURL("/todos");
	}

	async navigateToAI() {
		await this.aiLink.click();
		await this.page.waitForURL("/ai");
	}

	async getUserEmail() {
		return await this.userEmail.textContent();
	}
}