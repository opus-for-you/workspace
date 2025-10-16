# Opus - Personal and Client Management App

## Overview

Opus is a full-stack productivity application designed for young professionals to manage their personal and professional lives. It provides comprehensive tools for goal tracking, task management, connection management, and weekly reflection. The application features an editorial magazine-inspired design system with light mode as default, emphasizing clean typography, generous whitespace, and professional aesthetics.

## User Preferences

- **Communication style**: Simple, everyday language
- **GitHub commits**: When user says "run commit", execute `tsx scripts/commit-to-github.ts` to sync documentation to GitHub

## Recent Changes (October 2025)

### Classical Organic Design System - Version 2.0 (Latest)
- **Complete Design Pivot**: Transformation from editorial magazine to classical oil painting aesthetic
  - **Borderless Design**: NO borders anywhere - depth achieved through layered shadow system only
  - **Organic Shapes**: Asymmetric border-radius (24px 32px 24px 16px) creates flowing, natural forms
  - **Dark Forest Green Accent**: #1B4332 as THE singular accent color for personality and focus
  - **Simplified Typography**: Only 2 fonts - Fraunces (headings 36-48px) and Inter (body 16px)
  - **Muted Palette**: Ivory (#FAFAFA), Alabaster (#F4F4F4), Pure White (#FFFFFF), Charcoal (#1C1C1C)
  - **Painterly Depth**: Multi-layer shadow system mimics classical oil painting layering
  - **Organic Components**: All cards, containers, and interactive elements use organic rounded shapes
- **CSS Utilities**: New organic design classes (.rounded-organic, .shadow-organic, .organic-item-hover)
- **Component Updates**: Dashboard, WeeklyPriorities, and ReflectionPrompt redesigned with organic aesthetic
- **Font Cleanup**: Removed Crimson Pro and JetBrains Mono - simplified to Fraunces + Inter only

### MVP Completion - Version 1.0
- **Complete Authentication System**: Secure session-based authentication with password hashing, login/register flows, and protected routes
- **Dashboard**: Overview page with metrics for goals, tasks, and connections
- **Connections Management**: Full CRUD interface for tracking professional relationships
- **Goals Tracking**: Create and monitor goals with progress indicators (0-100%) and status tracking
- **Task Management**: Task organization with priority levels, status updates, and optional goal associations
- **Weekly Review**: Structured reflection interface for wins, challenges, learnings, and planning
- **Security Hardening**: 
  - Password hashes sanitized from all API responses using SafeUser type
  - Input validation on all PATCH endpoints using Zod partial schemas
  - Production-ready session cookies (httpOnly, sameSite: lax, secure in production)
  - 7-day session expiry with PostgreSQL session storage
- **UX Polish**:
  - Proper navigation and routing with authenticated/unauthenticated flows
  - Post-login/register redirects to dashboard
  - Post-logout redirect to auth page

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript in a single-page application (SPA) architecture using Vite as the build tool.

**Routing Strategy**: Wouter is used as a lightweight alternative to React Router, providing client-side routing with minimal overhead. The application implements protected routes that redirect unauthenticated users to the authentication page.

**State Management**: TanStack Query (React Query v5) handles all server state, providing automatic caching, background refetching, and optimistic updates. No global client state management library is used - component state is managed locally with React hooks.

**UI Component System**: Built on shadcn/ui components, which are customized Radix UI primitives. This provides accessible, unstyled components that are styled with TailwindCSS. The design system follows a "New York" style variant with custom color schemes for dark and light modes.

**Form Handling**: React Hook Form manages form state with Zod schemas for runtime validation. This provides type-safe forms with minimal re-renders.

**Design System**: Classical organic aesthetic inspired by oil paintings. Borderless design uses layered shadows for depth. Organic asymmetric shapes (24px 32px 24px 16px radius) create flowing forms. Dark forest green (#1B4332) as the singular accent color. Simplified typography with only Fraunces (headings) and Inter (body). Light mode primary with ivory/alabaster/white backgrounds creating painterly depth hierarchy.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, following a RESTful API design pattern.

**Authentication System**: Passport.js with Local Strategy for username/password authentication. Passwords are hashed using Node's built-in scrypt algorithm with salt. Sessions are stored in PostgreSQL using connect-pg-simple for persistence across server restarts.

**Session Management**: Express-session with PostgreSQL session store ensures secure, server-side session management. Sessions are configured with secure cookies and trust proxy settings for deployment environments.

**Database Layer**: Drizzle ORM provides type-safe database queries with PostgreSQL. The ORM schema is defined in TypeScript and shared between frontend and backend for end-to-end type safety.

**Storage Pattern**: A unified `IStorage` interface abstracts all database operations, providing methods for CRUD operations on users, connections, goals, tasks, and weekly reviews. All queries enforce user-based data isolation.

**API Design**: RESTful endpoints under `/api/*` with consistent patterns:
- Authentication: `/api/register`, `/api/login`, `/api/logout`, `/api/user`
- Resources: `/api/[resource]` for GET/POST, `/api/[resource]/:id` for PATCH/DELETE
- All resource endpoints require authentication via middleware

### Data Model

**Schema Design**: Five main entities with PostgreSQL UUID primary keys:

1. **Users**: Basic authentication with username/password
2. **Connections**: Professional relationships with last contact tracking
3. **Goals**: Personal/professional objectives with progress tracking (0-100%)
4. **Tasks**: Actionable items with status (todo/in-progress/done), optional goal association
5. **Weekly Reviews**: Structured reflection with wins, lessons, and next steps

**Relationships**:
- All entities belong to a user (one-to-many via `userId` foreign key)
- Tasks optionally reference goals (many-to-one via `goalId` foreign key with SET NULL on delete)
- Cascade deletion ensures data cleanup when users are deleted

**Validation**: Zod schemas are generated from Drizzle table definitions using `drizzle-zod`, ensuring consistent validation between database and API layers.

### Development Workflow

**Build Process**: Vite handles frontend bundling with hot module replacement (HMR) in development. Production builds generate optimized static assets served by Express.

**Type Safety**: Shared TypeScript types between frontend and backend via `@shared` path alias. Database schema types are automatically generated by Drizzle ORM.

**Development Server**: Single Express server proxies Vite dev server in development, serves static files in production. Request logging middleware tracks API performance.

**Database Migrations**: Drizzle Kit manages schema migrations with a `db:push` command for development. Migration files are generated in the `/migrations` directory.

## External Dependencies

### Database

**PostgreSQL via Neon Serverless**: Uses `@neondatabase/serverless` for WebSocket-based connection pooling. Configured via `DATABASE_URL` environment variable. The serverless driver is chosen for compatibility with edge deployments and connection pooling optimization.

### UI Libraries

**Radix UI**: Headless, accessible component primitives for dialogs, dropdowns, popovers, tooltips, etc. Provides keyboard navigation, focus management, and ARIA attributes.

**TailwindCSS**: Utility-first CSS framework with custom configuration for design tokens. PostCSS and Autoprefixer handle CSS processing.

### Development Tools

**Replit Integration**: 
- Runtime error overlay plugin for development
- Cartographer plugin for code navigation
- Dev banner for Replit-specific features
- GitHub connector for repository integration (via Octokit)

### Utility Libraries

**date-fns**: Date manipulation and formatting without the bulk of moment.js
**clsx + tailwind-merge**: Conditional className composition
**nanoid**: Unique ID generation for client-side operations

### Future Integration Points

**AI Services Placeholder**: `/client/src/lib/ai.ts` contains placeholder functions for future OpenAI/Anthropic integration for:
- Weekly review reflection prompts
- Goal recommendations
- Task prioritization suggestions
- Connection insights

These are currently stubbed out and documented in the roadmap for Phase 2 implementation.