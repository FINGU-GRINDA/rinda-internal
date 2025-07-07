# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using oRPC for type-safe API routing, built for people search and data enrichment. The project uses Prisma with PostgreSQL, Qdrant for vector search, and Jina AI for embeddings.

## Development Commands

```bash
# Development
npm run dev          # Start development server on port 3000 with Turbopack

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality (run these after making changes)
npm run format       # Format code with Biome
npm run lint         # Run Next.js linter
npm run type:check   # TypeScript type checking

# Database
npx prisma generate  # Generate Prisma client after schema changes
npx prisma migrate dev  # Run database migrations in development
```

## Architecture Overview

### API Layer (oRPC)
- All API routes are defined in `src/router/` using oRPC
- Type-safe RPC with automatic OpenAPI generation
- API documentation available at `/api/rpc` in development
- Use `pub` for public endpoints, `authed` for authenticated endpoints

Example pattern:
```typescript
// Public endpoint
export const searchPeople = pub
  .route({ method: "GET", path: "/people" })
  .input(SearchPeopleSchema)
  .output(PeopleResponseSchema)
  .handler(async ({ input, context }) => { ... })

// Protected endpoint  
export const createPeople = authed
  .route({ method: "POST", path: "/people" })
  .input(CreatePeopleSchema)
  .handler(async ({ input, context }) => { ... })
```

### Authentication
- Better Auth with Prisma adapter handles all authentication
- Google OAuth is configured
- Protected routes use `(protected)` folder in app directory
- Session-based authentication with `context.user` available in authed endpoints

### Vector Search Architecture
- Qdrant stores embeddings for semantic search
- Jina AI creates 128-dimensional embeddings
- Search flow: Query → Jina embedding → Qdrant similarity search → Results

### Component Structure
- UI components in `src/components/ui/` are Radix UI primitives (don't modify these)
- Business components in `src/components/` can be modified
- Tailwind CSS v4 with CSS variables for theming
- OKLCH color space for better color manipulation

## Key Patterns

### Environment Variables
- Public: `src/publicEnv.ts` - Client-side variables
- Private: `src/privateEnv.ts` - Server-side variables
- All variables are validated with Zod schemas

### Error Handling
- oRPC provides automatic error handling
- Use standard try/catch in handlers
- Errors are automatically formatted for API responses

### Database Access
- Always use Prisma client from `context.db` in API handlers
- Database middleware provides the connection
- Never import Prisma client directly in route handlers

## Common Tasks

### Adding a New API Endpoint
1. Create handler in appropriate file in `src/router/`
2. Define input/output schemas in `src/schemas/`
3. Export from `src/router/index.ts`
4. Use `pub` or `authed` based on authentication needs

### Adding a New Page
1. Create folder in `src/app/` 
2. For protected pages, place under `(protected)/`
3. Use `page.tsx` for the page component
4. Include proper metadata exports

### Working with Vector Search
1. Use `JinaService` to create embeddings
2. Store embeddings in Qdrant with metadata
3. Search using `QdrantClient` with vector similarity

## Code Style Requirements
- Tab indentation (configured in Biome)
- Double quotes for strings
- Run `npm run format` before committing
- TypeScript strict mode is enabled - avoid `any` types