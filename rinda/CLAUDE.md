# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lead generation and data enrichment platform built with Next.js 15, using AI-powered validation and semantic search capabilities. The application allows users to create "websets" (collections of search results) that are validated and enriched using AI agents.

## Development Commands

```bash
# Start development server with Turbopack (port 3000)
npm run dev

# Start Mastra development server (AI workflows)
npm run dev:mastra

# Build for production
npm run build
npm run build:mastra

# Start production server
npm run start

# Code quality checks (run these before committing)
npm run lint          # Run Biome linter
npm run type:check    # TypeScript type checking
npm run format        # Format code with Biome

# Run E2E tests
npx playwright test
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.5 with App Router and Turbopack
- **Language**: TypeScript 5.8.3 with strict mode
- **Database**: PostgreSQL with Prisma ORM 6.11.1
- **Authentication**: Better Auth with Google OAuth
- **RPC Framework**: oRPC for type-safe API endpoints
- **AI Framework**: Mastra for agents and workflows
- **Vector Database**: Qdrant for semantic search
- **Cache**: Redis
- **Styling**: TailwindCSS v4
- **State Management**: Tanstack Query v5
- **Code Quality**: Biome (replaces ESLint/Prettier)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Auth-required routes
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   └── rpc/               # oRPC endpoints
├── components/            # React components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities
│   ├── auth.ts          # Better Auth setup
│   ├── orpc.ts          # oRPC client/server
│   └── query/           # React Query setup
├── mastra/              # AI agent framework
│   ├── agents/          # Validation agents
│   ├── tools/           # Agent tools
│   └── workflows/       # AI workflows
├── router/              # oRPC routers
├── schemas/             # Zod schemas
└── services/            # External integrations
```

### Key Database Models
- **User**: Authentication users
- **Session/Account**: Auth-related models
- **Webset**: Search queries with validation criteria
- **WebsetRow**: Individual results with validation status

## Important Development Notes

1. **Path Aliases**: Use `@/` for imports (maps to `src/`)
   ```typescript
   import { Component } from '@/components/component'
   ```

2. **Authentication**: All routes under `(protected)` require authentication. Use the auth middleware from `@/lib/auth.ts`

3. **API Development**: Use oRPC routers in `src/router/` for type-safe API endpoints. The client is available via `@/lib/orpc.ts`

4. **AI Workflows**: Mastra agents in `src/mastra/agents/` handle validation. Always build Mastra workflows after changes:
   ```bash
   npm run build:mastra
   ```

5. **Database Changes**: After modifying `prisma/schema.prisma`:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Code Style**: Biome enforces:
   - Tab indentation
   - Double quotes for strings
   - Automatic formatting on save

7. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   - Database URL
   - Qdrant credentials
   - Jina API key
   - Better Auth secret
   - Google OAuth credentials
   - Redis URL

8. **Testing**: Write E2E tests in `tests/` directory using Playwright

9. **Type Safety**: The project uses strict TypeScript. Always run `npm run type:check` before committing

10. **Component Development**: UI components in `src/components/ui/` use Radix UI primitives with custom styling

## Current Development Focus

Recent work has focused on:
- Webset processing with background tasks
- Dynamic column selection in results tables
- Loading states and error handling
- LinkedIn URL formatting and data enrichment

## External Services

- **Qdrant**: Vector search for semantic queries
- **Jina**: Document processing and enrichment
- **Redis**: Caching and background job queues
- **OpenAI**: AI model integration via AI SDK