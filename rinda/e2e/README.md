# E2E Testing with Playwright

This directory contains end-to-end tests for the Rinda application using Playwright.

## Setup

1. Install Playwright browsers (first time only):
   ```bash
   npx playwright install
   ```

2. Set up test environment variables:
   - Copy `.env.test` to `.env.test.local` and update with your test database URL
   - Ensure your test database is running

3. Create a test user in your database or ensure the authentication system allows registration

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Test Structure

- `tests/` - Test files organized by feature
- `pages/` - Page Object Model classes
- `fixtures/` - Custom test fixtures and setup
- `utils/` - Helper utilities for tests

## Writing Tests

1. Use the Page Object Model pattern for maintainability
2. Use the `authenticatedPage` fixture for tests requiring login
3. Keep tests independent and atomic
4. Clean up test data after each test when possible

## CI/CD

Tests run automatically on pull requests. The CI environment uses:
- Headless browsers
- Test database
- Parallelization disabled for stability