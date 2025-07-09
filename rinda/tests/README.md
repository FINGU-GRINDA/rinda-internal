# Playwright E2E Tests

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create credentials file (DO NOT COMMIT):
   ```bash
   # Create tests/.credentials.json with the following structure:
   {
     "google": {
       "email": "your-email@example.com",
       "password": "your-password"
     }
   }
   ```

3. Ensure the credentials file is in .gitignore (already configured).

## Running Tests

```bash
# Run all tests
npx playwright test

# Run auth tests only
npx playwright test auth.spec.ts

# Run tests in UI mode (recommended for debugging)
npx playwright test --ui

# Run tests with specific browser
npx playwright test --project=chromium
```

## Authentication Flow

The auth tests handle Google OAuth login. The authentication state is saved to `playwright/.auth/user.json` and can be reused across tests.

**Note**: Google OAuth may require additional verification steps (2FA, security challenges) depending on your account settings. You may need to:
- Disable 2FA for the test account
- Add the test environment to trusted devices
- Use app-specific passwords if 2FA is enabled

## Debugging

- Use `--debug` flag to run tests in debug mode
- Screenshots are saved on test failure
- Traces are collected on retry

## Security Notes

- NEVER commit `.credentials.json` to the repository
- The file is already added to `.gitignore`
- Consider using environment variables for CI/CD environments
- Use dedicated test accounts with limited permissions