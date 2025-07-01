import { test, expect } from "../fixtures/base";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Authentication", () => {
	let loginPage: LoginPage;
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		dashboardPage = new DashboardPage(page);
	});

	test("should show login page for unauthenticated users", async ({ page }) => {
		await page.goto("/dashboard");
		await expect(page).toHaveURL("/login");
	});

	test("should display error for invalid credentials", async ({ page }) => {
		await loginPage.goto();
		await loginPage.login("invalid@example.com", "wrongpassword");
		
		const hasError = await loginPage.expectError("Invalid credentials");
		expect(hasError).toBeTruthy();
	});

	test("should login with valid credentials", async ({ page }) => {
		await loginPage.goto();
		await loginPage.login("test@example.com", "testpassword123");
		
		await expect(page).toHaveURL("/dashboard");
		await expect(dashboardPage.heading).toContainText("Dashboard");
	});

	test("should logout successfully", async ({ authenticatedPage }) => {
		const dashboard = new DashboardPage(authenticatedPage);
		await dashboard.goto();
		await dashboard.logout();
		
		await expect(authenticatedPage).toHaveURL("/");
	});

	test("should persist authentication across page refreshes", async ({ authenticatedPage }) => {
		await authenticatedPage.goto("/dashboard");
		await authenticatedPage.reload();
		
		await expect(authenticatedPage).toHaveURL("/dashboard");
		await expect(dashboardPage.heading).toBeVisible();
	});

	test("should redirect to originally requested page after login", async ({ page }) => {
		// Try to access protected route
		await page.goto("/todos");
		await expect(page).toHaveURL("/login");
		
		// Login
		await loginPage.login("test@example.com", "testpassword123");
		
		// Should redirect to todos page
		await expect(page).toHaveURL("/todos");
	});
});