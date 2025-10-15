# Opus Architecture

## Overview
Opus is a full-stack web application designed for young professionals to manage their personal and professional lives. The application follows a modern, scalable architecture with clear separation of concerns.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: TailwindCSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query v5)
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js (local strategy)
- **Session Management**: express-session with PostgreSQL store
- **Validation**: Zod schemas

### Infrastructure
- **Database**: PostgreSQL with connection pooling
- **Session Store**: PostgreSQL (via connect-pg-simple)
- **Environment**: Replit (development and hosting)

## Architecture Layers

### 1. Data Layer (`shared/schema.ts`)
- Defines all database tables using Drizzle ORM
- Exports TypeScript types for type safety
- Implements relationships between entities
- Provides Zod schemas for validation

**Tables:**
- `users` - User accounts
- `connections` - Professional relationships
- `goals` - Personal and professional objectives
- `tasks` - Task management with goal associations
- `weeklyReviews` - Weekly reflection entries

### 2. Storage Layer (`server/storage.ts`)
- Implements `IStorage` interface for all CRUD operations
- Uses Drizzle ORM for database queries
- Ensures data isolation per user
- Manages session store for authentication

### 3. API Layer (`server/routes.ts`)
- RESTful API endpoints
- Authentication middleware
- Request validation using Zod schemas
- Proper error handling and status codes

**Endpoints:**
- `/api/user` - Authentication status
- `/api/register` - User registration
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/connections` - Connection CRUD
- `/api/goals` - Goal CRUD
- `/api/tasks` - Task CRUD
- `/api/reviews` - Weekly review CRUD

### 4. Authentication Layer (`server/auth.ts`)
- Passport.js local strategy
- Password hashing with scrypt
- Session-based authentication
- Secure credential storage

### 5. Frontend Application Layer

#### Routing & Layout (`client/src/App.tsx`)
- Protected routes for authenticated users
- Sidebar navigation
- Theme provider for dark/light mode
- Global state management with Auth context

#### Pages
- **AuthPage**: Login and registration forms
- **DashboardPage**: Overview with metrics and insights
- **GoalsPage**: Goal tracking with progress indicators
- **TasksPage**: Task management with kanban/list views
- **ConnectionsPage**: Relationship management with grid/list views
- **WeeklyReviewPage**: Reflection and planning interface

#### Shared Hooks
- `useAuth`: Authentication state and mutations
- React Query hooks for data fetching

## Data Flow

### Authentication Flow
1. User submits credentials via AuthPage
2. Frontend calls `/api/login` or `/api/register`
3. Backend validates credentials
4. Passport.js creates session
5. Session stored in PostgreSQL
6. User data returned to frontend
7. React Query caches user data
8. Protected routes become accessible

### CRUD Operations Flow
1. User interacts with UI (e.g., creates a task)
2. Form validation with Zod schema
3. React Query mutation triggered
4. API request to backend endpoint
5. Authentication middleware checks session
6. Request validation against schema
7. Storage layer performs database operation
8. Response returned to frontend
9. React Query cache updated
10. UI automatically re-renders

## Security Features

1. **Password Security**
   - Passwords hashed using scrypt
   - Salt generated per password
   - Timing-safe comparison

2. **Session Management**
   - Secure session cookies
   - PostgreSQL-backed sessions
   - Session expiration

3. **Authorization**
   - User-scoped data queries
   - Authentication middleware on all protected routes
   - Request validation

4. **Input Validation**
   - Zod schemas on both frontend and backend
   - Type-safe data structures
   - SQL injection protection via ORM

## Design System

The application follows a cohesive design system defined in `design_guidelines.md`:
- Modern productivity-focused aesthetics
- Dark mode primary, light mode secondary
- Consistent spacing and typography
- Accessible color contrast
- Responsive mobile-first design
- Smooth interactions and transitions

## Future Enhancements

### Planned Features
1. **AI Integration** (`client/src/lib/ai.ts`)
   - Weekly review reflection prompts
   - Goal suggestions
   - Task prioritization

2. **Push Notifications**
   - Task reminders using node-cron
   - Connection follow-up alerts

3. **Analytics Dashboard**
   - Productivity trends
   - Goal completion rates
   - Connection relationship insights

4. **Collaboration Features**
   - Shared goals
   - Task delegation
   - Team accountability

## Development Workflow

1. **Schema First**: Define data models in `shared/schema.ts`
2. **Storage Layer**: Implement CRUD in `server/storage.ts`
3. **API Routes**: Create endpoints in `server/routes.ts`
4. **Frontend Components**: Build UI with React Query integration
5. **Database Migration**: Run `npm run db:push` to sync schema
6. **Testing**: Validate functionality end-to-end

## File Structure

```
opus/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main application component
│   └── index.html         # HTML entry point
│
├── server/                # Backend application
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry point
│
├── shared/               # Shared code
│   └── schema.ts        # Database schema and types
│
└── docs/                # Documentation
    ├── architecture.md
    ├── api_endpoints.md
    ├── setup_guide.md
    └── roadmap.md
```
