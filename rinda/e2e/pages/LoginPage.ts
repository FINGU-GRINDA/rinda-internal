import type { Page, Locator } from "@playwright/test";

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;
	readonly signupLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.locator('input[name="email"]');
		this.passwordInput = page.locator('input[name="password"]');
		this.submitButton = page.locator('button[type="submit"]');
		this.errorMessage = page.locator('[role="alert"]');
		this.signupLink = page.locator('text=/sign up/i');
	}

	async goto() {
		await this.page.goto("/login");
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}

	async expectError(message: string) {
		await this.errorMessage.waitFor();
		await this.page.waitForTimeout(500); // Allow error to fully render
		const errorText = await this.errorMessage.textContent();
		return errorText?.includes(message);
	}
}