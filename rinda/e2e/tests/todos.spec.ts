import { test, expect } from "../fixtures/base";
import { TodoPage } from "../pages/TodoPage";

test.describe("Todo Management", () => {
	let todoPage: TodoPage;

	test.beforeEach(async ({ authenticatedPage }) => {
		todoPage = new TodoPage(authenticatedPage);
		await todoPage.goto();
	});

	test("should display todo page", async ({ authenticatedPage }) => {
		await expect(authenticatedPage).toHaveURL("/todos");
		await expect(authenticatedPage.locator("h1")).toContainText("Todos");
	});

	test("should add a new todo", async () => {
		const todoText = "Test todo item " + Date.now();
		await todoPage.addTodo(todoText);
		
		const todoCount = await todoPage.getTodoCount();
		expect(todoCount).toBeGreaterThan(0);
		
		const lastTodoText = await todoPage.getTodoText(todoCount - 1);
		expect(lastTodoText).toContain(todoText);
	});

	test("should toggle todo completion", async () => {
		// Add a todo first
		await todoPage.addTodo("Todo to complete");
		const todoIndex = (await todoPage.getTodoCount()) - 1;
		
		// Check it's not completed initially
		expect(await todoPage.isTodoCompleted(todoIndex)).toBe(false);
		
		// Toggle completion
		await todoPage.toggleTodo(todoIndex);
		expect(await todoPage.isTodoCompleted(todoIndex)).toBe(true);
		
		// Toggle back
		await todoPage.toggleTodo(todoIndex);
		expect(await todoPage.isTodoCompleted(todoIndex)).toBe(false);
	});

	test("should delete a todo", async () => {
		// Add a todo to delete
		await todoPage.addTodo("Todo to delete");
		const initialCount = await todoPage.getTodoCount();
		
		// Delete the last todo
		await todoPage.deleteTodo(initialCount - 1);
		
		const newCount = await todoPage.getTodoCount();
		expect(newCount).toBe(initialCount - 1);
	});

	test("should handle multiple todos", async () => {
		const todos = [
			"First todo",
			"Second todo",
			"Third todo",
		];
		
		// Add multiple todos
		for (const todo of todos) {
			await todoPage.addTodo(todo);
		}
		
		const todoCount = await todoPage.getTodoCount();
		expect(todoCount).toBeGreaterThanOrEqual(todos.length);
	});

	test("should persist todos after page refresh", async ({ authenticatedPage }) => {
		// Add a unique todo
		const uniqueTodo = "Persistent todo " + Date.now();
		await todoPage.addTodo(uniqueTodo);
		
		// Refresh the page
		await authenticatedPage.reload();
		
		// Check the todo is still there
		const todoCount = await todoPage.getTodoCount();
		let found = false;
		for (let i = 0; i < todoCount; i++) {
			const text = await todoPage.getTodoText(i);
			if (text?.includes(uniqueTodo)) {
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	test("should not allow empty todos", async () => {
		await todoPage.todoInput.fill("");
		await todoPage.addButton.click();
		
		// The button should be disabled or no new todo should be added
		// This depends on the implementation, adjust as needed
		const currentCount = await todoPage.getTodoCount();
		await todoPage.todoInput.fill("");
		await todoPage.addButton.click();
		await todoPage.page.waitForTimeout(500);
		
		const newCount = await todoPage.getTodoCount();
		expect(newCount).toBe(currentCount);
	});
});