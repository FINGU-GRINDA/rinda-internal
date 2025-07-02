# Git Hooks with Lefthook and Biome

This project uses Lefthook to manage Git hooks and Biome for code formatting and linting.

## Setup

Git hooks are automatically installed when you run `npm install` (via the `prepare` script).

If hooks aren't working, manually install them:
```bash
npx lefthook install
```

## Hooks Configuration

### Pre-commit
- **Biome Format**: Automatically formats staged files (JS, TS, JSX, TSX, JSON, MD)
- **Biome Lint**: Runs linting on staged JavaScript/TypeScript files
- Both commands will auto-fix issues and re-stage the fixed files

### Commit-msg
- Validates commit messages follow conventional commits format
- Format: `<type>(<scope>): <subject>`
- Valid types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

### Pre-push
- Runs type checking across the entire monorepo
- Runs full Biome check to ensure code quality

## Bypassing Hooks

If you need to bypass hooks temporarily:
```bash
git commit --no-verify -m "your message"
git push --no-verify
```

## Troubleshooting

1. **Hooks not running**: Run `npx lefthook install`
2. **Permission errors**: Check that `.git/hooks` files are executable
3. **Biome errors**: Run `npm run check` to see and fix all issues

## Conventional Commits Examples

- `feat(auth): add social login support`
- `fix(ui): resolve button alignment issue`
- `docs: update API documentation`
- `chore(deps): upgrade React to v19`
- `refactor(server): simplify error handling`