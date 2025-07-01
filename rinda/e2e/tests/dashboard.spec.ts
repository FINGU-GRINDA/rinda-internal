import { test, expect } from "../fixtures/base";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Dashboard", () => {
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		dashboardPage = new DashboardPage(authenticatedPage);
		await dashboardPage.goto();
	});

	test("should display dashboard for authenticated users", async ({ authenticatedPage }) => {
		await expect(authenticatedPage).toHaveURL("/dashboard");
		await expect(dashboardPage.heading).toContainText("Dashboard");
	});

	test("should display user email", async () => {
		const email = await dashboardPage.getUserEmail();
		expect(email).toContain("@");
	});

	test("should have navigation links", async ({ authenticatedPage }) => {
		// Check todos link
		await expect(dashboardPage.todoLink).toBeVisible();
		await expect(dashboardPage.todoLink).toHaveAttribute("href", "/todos");
		
		// Check AI link
		await expect(dashboardPage.aiLink).toBeVisible();
		await expect(dashboardPage.aiLink).toHaveAttribute("href", "/ai");
	});

	test("should navigate to todos page", async ({ authenticatedPage }) => {
		await dashboardPage.navigateToTodos();
		await expect(authenticatedPage).toHaveURL("/todos");
	});

	test("should navigate to AI page", async ({ authenticatedPage }) => {
		await dashboardPage.navigateToAI();
		await expect(authenticatedPage).toHaveURL("/ai");
	});

	test("should have logout button", async () => {
		await expect(dashboardPage.logoutButton).toBeVisible();
		await expect(dashboardPage.logoutButton).toContainText("Sign out");
	});
});