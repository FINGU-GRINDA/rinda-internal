import type { Page, Locator } from "@playwright/test";

export class TodoPage {
	readonly page: Page;
	readonly todoInput: Locator;
	readonly addButton: Locator;
	readonly todoList: Locator;
	readonly todoItems: Locator;
	readonly deleteButtons: Locator;
	readonly checkboxes: Locator;

	constructor(page: Page) {
		this.page = page;
		this.todoInput = page.locator('input[placeholder*="todo"]');
		this.addButton = page.locator('button:has-text("Add")');
		this.todoList = page.locator('[role="list"]');
		this.todoItems = page.locator('li[role="listitem"]');
		this.deleteButtons = page.locator('button[aria-label*="Delete"]');
		this.checkboxes = page.locator('input[type="checkbox"]');
	}

	async goto() {
		await this.page.goto("/todos");
	}

	async addTodo(text: string) {
		await this.todoInput.fill(text);
		await this.addButton.click();
		await this.page.waitForResponse((response) =>
			response.url().includes("/rpc/todo.create") && response.status() === 200
		);
	}

	async toggleTodo(index: number) {
		await this.checkboxes.nth(index).click();
		await this.page.waitForResponse((response) =>
			response.url().includes("/rpc/todo.update") && response.status() === 200
		);
	}

	async deleteTodo(index: number) {
		await this.deleteButtons.nth(index).click();
		await this.page.waitForResponse((response) =>
			response.url().includes("/rpc/todo.delete") && response.status() === 200
		);
	}

	async getTodoCount() {
		return await this.todoItems.count();
	}

	async getTodoText(index: number) {
		return await this.todoItems.nth(index).textContent();
	}

	async isTodoCompleted(index: number) {
		return await this.checkboxes.nth(index).isChecked();
	}
}