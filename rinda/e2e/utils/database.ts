import { execSync } from "child_process";
import path from "path";

export async function setupTestDatabase() {
	const testDatabaseUrl = process.env.TEST_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/rinda_test";
	
	// Set the test database URL
	process.env.DATABASE_URL = testDatabaseUrl;
	
	try {
		// Push the schema to the test database
		execSync("npm run db:push", {
			cwd: path.join(process.cwd(), "apps/server"),
			env: { ...process.env, DATABASE_URL: testDatabaseUrl },
			stdio: "ignore",
		});
		
		console.log("Test database setup complete");
	} catch (error) {
		console.error("Failed to setup test database:", error);
		throw error;
	}
}

export async function cleanupTestDatabase() {
	// This function can be extended to clean up test data between tests
	// For now, we'll rely on database transactions or manual cleanup in tests
	console.log("Test database cleanup complete");
}

export async function createTestUser(email: string = "test@example.com", password: string = "testpassword123") {
	// This would typically use the auth library to create a test user
	// For now, this is a placeholder that can be implemented with Better Auth
	return {
		email,
		password,
		id: "test-user-id",
	};
}