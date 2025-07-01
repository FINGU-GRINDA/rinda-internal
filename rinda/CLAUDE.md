# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rinda is a TypeScript monorepo application built with Better-T-Stack, featuring:
- **Frontend**: Next.js 15.3.0 with React 19, running on port 3001
- **Backend**: Hono server with ORPC for type-safe APIs, running on port 3000
- **Database**: PostgreSQL with Prisma ORM
- **Build System**: Turborepo for optimized monorepo builds

## Essential Development Commands

```bash
# Start development servers (both frontend and backend)
npm run dev

# Start individual apps
npm run dev:web     # Frontend only
npm run dev:server  # Backend only

# Database operations
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Prisma Studio UI
npm run db:generate # Regenerate Prisma client
npm run db:migrate  # Run database migrations

# Code quality
npm run check       # Run Biome formatting and linting
npm run check-types # TypeScript type checking across all apps

# Build for production
npm run build       # Build all apps
```

## Code Architecture

### API Structure (apps/server)
- **ORPC Router** at `/rpc/*` handles all RPC endpoints with end-to-end type safety
- **Auth endpoints** at `/api/auth/**` for Better Auth integration
- **AI endpoint** at `/ai` for streaming AI responses with Google Generative AI
- Prisma models split across multiple schema files in `prisma/schemas/`
- Generated Prisma client output to `prisma/generated/`

### Frontend Structure (apps/web)
- Next.js App Router with TypeScript and React Server Components
- **Routes**:
  - `/` - Public home page
  - `/login` - Authentication page
  - `/dashboard` - Protected dashboard (requires authentication)
  - `/todos` - Todo list example with CRUD operations
  - `/ai` - AI chat interface with streaming
- **UI Components**: Using shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS v4 with dark mode support via next-themes
- **Data Fetching**: TanStack Query with ORPC client for type-safe API calls

### Key Technical Decisions
1. **Type Safety**: ORPC provides end-to-end type safety between frontend and backend
2. **Authentication**: Better Auth with Prisma adapter, using email/password
3. **Code Style**: Biome for formatting (tabs, double quotes) and linting
4. **Path Aliases**: `@/*` maps to `src/*` in both apps
5. **Environment Variables**:
   - Server: `DATABASE_URL`, `CORS_ORIGIN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`
   - Web: `NEXT_PUBLIC_SERVER_URL`

### Development Workflow
1. Always run `npm run check` before committing to ensure code quality
2. Use `npm run db:studio` to inspect database during development
3. The monorepo uses Turborepo caching - builds are incremental
4. Hot reloading enabled in both frontend (Turbopack) and backend (tsx watch)

### Testing Approach
- Run individual tests with standard npm/node test runners
- Type checking serves as the primary validation layer
- Manual testing through Prisma Studio for database operations

## Important Patterns

### Protected API Routes
```typescript
// Use auth().protectedProcedure for authenticated endpoints
.protectedProcedure
.input(schema)
.mutation(async ({ input, ctx }) => {
  // ctx.user is available here
})
```

### Database Operations
```typescript
// Always use the generated Prisma client from the custom output path
import { prisma } from "@/lib/prisma";
```

### Frontend Data Fetching
```typescript
// Use the ORPC client with TanStack Query
const { data, isLoading } = orpc.endpoint.useQuery();
```