# Opus - Personal and Client Management App

## Overview

Opus is a full-stack productivity application designed for young professionals to manage their personal and professional lives. It provides comprehensive tools for goal tracking, task management, connection management, and weekly reflection. The application features an editorial magazine-inspired design system with light mode as default, emphasizing clean typography, generous whitespace, and professional aesthetics.

## User Preferences

- **Communication style**: Simple, everyday language
- **GitHub commits**: When user says "run commit", execute `tsx scripts/commit-to-github.ts` to sync documentation to GitHub

## Recent Changes (October 2025)

### Editorial Magazine Design System - Version 1.5 (Latest)
- **Editorial Navigation**: Replaced sidebar with top horizontal navigation bar
  - Sticky positioning with backdrop blur effect
  - Desktop: horizontal nav links (Dashboard, Goals, Reflect, Profile)
  - Mobile: hamburger menu with Sheet component
  - Editorial typography and spacing
  - Active link highlighting
  - Seamless logout integration

### Editorial Magazine Design System - Version 1.4
- **Onboarding Integration**: Onboarding responses now saved to user profile
  - Users table enhanced with `vision`, `energy`, `direction`, `obstacles` fields
  - POST /api/onboarding endpoint stores reflective answers
  - User vision displayed as "North Star" on dashboard
- **Dashboard Redesign**: Complete editorial magazine-style overhaul
  - **North Star Section**: Hero area featuring user's vision statement
  - **This Week**: Task list with numbered items, context, timing, and energy indicators
  - **Current Chapter**: Large display numbers showing metrics (days, connections, milestones, alignment)
  - **Active Goals**: Card-based goal display with category labels and progress bars
  - **Sidebar Components**: Weekly reflection prompt, energy patterns, upcoming items
  - **Animation**: Staggered entry, hover micro-interactions, smooth page transitions
- **Enhanced Data Model**:
  - Tasks: Added `context`, `timing`, `energy`, `priority` fields for better workflow management
  - Goals: Added `category` field for organization
  - Users: Added onboarding response fields for personalization
- **Editorial Components Library** (`@/components/editorial`):
  - `EditorialHeading` - Animated display headings with size variants
  - `EditorialLabel` - Uppercase tracked labels with fade-in
  - `EditorialText` - Editorial body text component
  - `ProgressLine` - Animated progress visualization
  - `BreathingContainer` - Generous padding container
- **Design System**: Pearl borders (#E8E8E8), 0.25rem radius, sage green accents (#158 25% 31%), four-font hierarchy
- **CSS Utilities**: .editorial-card, .editorial-number, .editorial-label, .section-title, .metric-card, .breathing-space
- **Animation Library**: fadeInUp, staggerContainer variants, custom transitions

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

**Design System**: Editorial magazine aesthetic with refined typography and generous whitespace. Pearl borders (#E8E8E8) define cards with 8px radius. Sage green accent colors provide sophisticated personality. Four-font hierarchy: Fraunces (display), Crimson Pro (editorial), Inter (body), JetBrains Mono (data). Light mode primary with ivory/alabaster/white backgrounds creating magazine-quality reading experience.

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