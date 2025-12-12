# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Opus** is a professional transformation tool with a mobile application. The system uses AI (Claude) to help users clarify their purpose, generate goals, and build their professional network through three core pillars: **Purpose**, **Method**, and **Network**.

### The Opus Framework (3 Pillars)

The core of this application is built around **3 foundational pillars**:

1. **Purpose Pillar** 🎯 - Three micro-prompts help users articulate their career vision:
   - "Describe a moment when work felt perfectly aligned"
   - "Imagine your career 10 years from now"
   - "What's a career version you haven't imagined yet"
   - AI generates a 1-paragraph synthesis from these prompts

2. **Method Pillar** 🔧 - Workstyle profile to understand how users work best:
   - "How do you work best?" (multiple choice)
   - "What usually gets you stuck?" (free text)

3. **Network Pillar** 🌐 - Track 3 key professional relationships:
   - **Mentor** - Someone who guides your development
   - **Peer** - Someone you support each other with
   - **Collaborator** - Someone you work with on projects

**Framework Implementation:** Schema defined in `/shared/schema.ts`, AI synthesis in `/server/lib/ai-mvp.ts`

## Commands

### Quick Start (Recommended for New Developers)
```bash
npm run quick-start      # Interactive setup wizard (installs deps, creates .env, guides through startup)
npm run setup            # Install dependencies and create .env template
npm run health-check     # Verify environment is properly configured
```

### Development
```bash
npm run start:backend    # Start backend server (validates .env first)
npm run start:mobile     # Start mobile app with Expo (checks MOCK_MODE status)
npm run dev              # Start backend server (direct, no validation)
npm run build            # Build for production
npm start                # Start Expo development server (mobile app)
npm run server           # Start production backend server
npm run ios              # Start iOS simulator
npm run android          # Start Android emulator
npm run web              # Start web version of mobile app
npm run check            # Run TypeScript type checking
```

### Database
```bash
npm run db:push          # Push schema changes to PostgreSQL database
npm run reset:db         # ⚠️ DANGER: Reset database (deletes all data)
```

### Mobile Development
All mobile commands now run from the root directory (no need to cd into mobile):
```bash
npm start                # Start Expo development server
npm run ios              # Start iOS simulator
npm run android          # Start Android emulator
npm run web              # Start web version
```

**💡 Tip:** See `/scripts/README.md` for detailed documentation on all helper scripts.

## Architecture

### Project Structure
This is a **mobile-first application** with the mobile app at the root level:

- **Mobile App**: Expo/React Native at root level (`/app`, `/lib`, `/assets`)
- **Backend API**: Express server in `/server` directory
- **Shared Types**: Database schema and types in `/shared/schema.ts`
- Single `package.json` with all dependencies merged

### Data Layer (`shared/schema.ts`)
All database tables are defined using Drizzle ORM with TypeScript types and Zod validation schemas:
- `users` - User accounts with Purpose Pillar data (purposePrompt1-3, purposeSummary) and Method Pillar data (workstyleBest, workstyleStuck)
- `keyPeople` - Network Pillar: Track 3 key relationships (mentor, peer, collaborator) with last interaction dates
- `connections` - Additional professional relationships and contacts (legacy)
- `goals` - Personal/professional objectives (supports AI-generated goals with `aiGenerated` flag)
- `tasks` - Task management with goal associations (supports AI-generated tasks)
- `weeklyReviews` - Weekly reflection entries

**Important**: The schema uses integer flags (0/1) instead of booleans for `aiGenerated` fields to ensure PostgreSQL compatibility.

### Storage Layer (`server/storage.ts`)
Implements `IStorage` interface for all CRUD operations. All queries are user-scoped for data isolation. Uses Drizzle ORM with PostgreSQL connection pooling.

### API Layer (`server/routes.ts` and `server/routes/*.ts`)
RESTful endpoints with modular route files:
- Main routes in `server/routes.ts` (auth, user via `setupAuth()`)
- Feature routes in `server/routes/`:
  - `onboarding.ts` - Purpose and Method pillar endpoints (Router-based)
  - `key-people.ts` - Network pillar endpoints (Router-based)
  - `goals.ts` - Goal management (function-based registration)
  - `tasks.ts` - Task management (function-based registration)
  - `connections.ts` - Legacy connections (function-based registration)
  - `reflections.ts` - Weekly reviews (function-based registration)
  - `ai.ts` - AI generation endpoints (function-based registration)
- All protected routes use `requireAuth` middleware
- Request validation using Zod schemas

### Authentication (`server/auth.ts`)
- Passport.js with local strategy
- Password hashing using **scrypt** (not bcrypt) with salt
- Session-based auth with PostgreSQL session store (connect-pg-simple)
- Sessions persist across server restarts

### AI Integration

**Current AI Service** (`server/lib/ai-mvp.ts`):
The app uses **Claude (Anthropic)** for AI-powered features:

**Primary AI Functions:**
- `generatePurposeSummary()` - Synthesizes user's 3 purpose prompts into a cohesive 1-paragraph summary
- `generateGoalsFromPurpose()` - Generates 3-4 goals based on the purpose summary
- `generateMilestonesFromGoal()` - Breaks down a goal into actionable milestones
- `analyzeCheckIn()` - Analyzes weekly check-ins and provides insights with network nudges

**Key Features:**
- Uses Claude Sonnet 4.5 model
- All functions have error handling with fallback responses
- Check-in analysis includes "network nudges" to remind users to connect with key people
- AI responses are conversational and coaching-focused

**Legacy AI Services:**
- `/server/lib/ai.ts` - Old implementation (deprecated)
- `/server/lib/ai-mobile/` - Old week-based implementation (deprecated)

### Frontend Architecture

#### Mobile App (Primary Interface)
The app is **mobile-first** with the following stack:

- Expo SDK ~54 with React Native 0.81
- File-based routing with expo-router
- NativeWind for TailwindCSS styling
- Zustand for state management (`/lib/auth-store.ts`)
- React Query for API data fetching
- expo-secure-store for token storage (not MMKV)
- **MOCK_MODE** flag allows full functionality without backend connection

**App Directory Structure:**
```
/app/
├── _layout.tsx           # Root layout (React Query provider)
├── index.tsx             # Entry point (routing logic) ⚠️ USES REDIRECT PATTERN
├── (auth)/               # Auth group (stack)
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (onboarding)/         # Onboarding group (stack) - 3 Pillars
│   ├── _layout.tsx
│   ├── purpose.tsx       # Purpose Pillar: 3 micro-prompts → AI summary
│   ├── method.tsx        # Method Pillar: workstyle profile
│   ├── key-people.tsx    # Network Pillar: 3 key relationships
│   └── goals.tsx         # AI-generated goals from purpose summary
├── (tabs)/               # Main app (tabs) ⚠️ USES TEXT FOR ICONS
│   ├── _layout.tsx       # Tab navigation
│   ├── index.tsx         # Dashboard
│   ├── goals.tsx         # Goals screen
│   ├── tasks.tsx         # Tasks screen
│   ├── reflections.tsx   # Reflections screen (check-ins)
│   └── profile.tsx       # Profile screen
├── goal-detail.tsx       # Goal detail with milestones
└── key-people.tsx        # Key people management
```

**Additional Directories:**
```
/lib/                     # Mobile utilities
├── auth-store.ts         # Zustand auth state management
└── api.ts                # API client and endpoints

/assets/                  # Mobile app assets
├── icon.png
├── splash-icon.png
└── adaptive-icon.png
```

**Mock Mode:**
The mobile app has a **MOCK_MODE** flag that allows full functionality without a backend connection:

**Files with MOCK_MODE:**
- `/lib/auth-store.ts` - Mock login/register (line 24)
- `/lib/api.ts` - Mock API responses (line 5)

**To Toggle:**
```typescript
const MOCK_MODE = true; // Set to false when backend is ready
```

**Mock Data Includes:**
- 3 sample goals with varying progress
- 4 sample tasks in different states
- 1 sample reflection
- Mock user with north star and program progress

**Current State:** Mobile app is FULLY FUNCTIONAL in MOCK_MODE - all screens work, all flows tested, ready for backend integration.

### Scheduled Tasks (`server/lib/scheduler.ts`)
Uses node-cron for background jobs. Initialize with `initializeScheduler()` on server start, cleanup with `shutdownScheduler()` on graceful shutdown.

## Development Workflow

When adding new features, follow this order:

1. **Define Schema** in `shared/schema.ts`
   - Add table definition using Drizzle ORM
   - Create insert schema with `createInsertSchema()`
   - Export TypeScript types
   - Add relations if needed

2. **Push Schema** to database
   ```bash
   npm run db:push
   ```

3. **Update Storage Layer** in `server/storage.ts`
   - Add methods to `IStorage` interface
   - Implement CRUD operations
   - Ensure user-scoped queries

4. **Add API Routes**
   - Create route file in `server/routes/` for new features
   - Or add to existing route files
   - Import and register in `server/routes.ts`
   - Use `requireAuth` middleware for protected endpoints
   - Validate requests with Zod schemas

5. **Build Mobile UI**
   - Add React Query hooks in mobile app
   - Create screens in `/app/` directory
   - Add utilities in `/lib/` directory
   - Update navigation in tab/stack layouts if needed
   - Use NativeWind for styling

## Important Patterns

### User-Scoped Queries
All database queries MUST filter by `userId` to ensure data isolation:
```typescript
const goals = await db.select().from(schema.goals)
  .where(eq(schema.goals.userId, userId));
```

### AI-Generated Content
When creating AI-generated goals or tasks, set `aiGenerated: 1` (not `true`):
```typescript
const goal = {
  title: "Learn TypeScript",
  aiGenerated: 1,  // Integer, not boolean
  userId: user.id
};
```

### Important Schema Fields
The schema includes fields for the 3-pillar onboarding:
- **Purpose Pillar Fields** (users table):
  - `purposePrompt1`, `purposePrompt2`, `purposePrompt3` - User's responses to 3 micro-prompts
  - `purposeSummary` - AI-generated 1-paragraph synthesis
- **Method Pillar Fields** (users table):
  - `workstyleBest` - How user works best (multiple choice)
  - `workstyleStuck` - What usually gets user stuck (free text)
- **Network Pillar Fields** (keyPeople table):
  - `name`, `type` (mentor/peer/collaborator), `why`, `lastInteraction`
- **AI-Generated Content**:
  - `goals.aiGenerated` - Integer flag (1 if AI-generated, 0 if user-created)
  - `tasks.aiGenerated` - Integer flag (1 if AI-generated, 0 if user-created)
  - `tasks.recommendedSchedule` - AI-suggested timing/day

### Authentication Flow
- Login/register via `/api/login` or `/api/register`
- Session created and stored in PostgreSQL
- Protected routes check `req.isAuthenticated()`
- User data cached in React Query

### Error Handling
- API routes return JSON with `{ message: string }` on errors
- Use appropriate HTTP status codes (400, 401, 404, 500)
- Frontend displays errors via toast notifications

## Design System

The Opus design system (documented in `/docs/design/`) emphasizes:
- **Editorial elegance** - Large, thoughtful typography using Fraunces and Crimson Pro
- **Breathing space** - Generous padding and margins
- **Minimal color** - Primarily grayscale with sage green accents
- **Smooth animations** - Subtle, refined transitions

See `/docs/design/design-system-reference.md` for complete guidelines.

## Environment Variables

Required for development:
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=random-secret-key
ANTHROPIC_API_KEY=sk-ant-...  # REQUIRED for AI features (Claude Sonnet 4.5)
```

Optional:
```env
PORT=5000  # Backend server port (defaults to 5000)
```

**Note:** The app currently only uses Claude (Anthropic) for AI features. OpenAI is not required.

## Database Configuration

Uses Neon serverless PostgreSQL. Connection pooling configured in `server/db.ts`. Drizzle Kit config in `drizzle.config.ts` points to `shared/schema.ts`.

## Build and Deployment

- Web build: Vite for frontend, esbuild for backend
- Production serves static frontend from Express
- Server always runs on port specified in `PORT` env var (default 5000)
- Graceful shutdown handlers for SIGTERM/SIGINT

## Mobile-Web API Sharing

The Express backend serves both web and mobile clients. Mobile app makes HTTP requests to the same API endpoints. Ensure authentication works cross-platform (session cookies for web, token/header auth may be needed for mobile in future).

### Key API Endpoints

**Authentication:**
- `POST /api/register` - Create new user account
- `POST /api/login` - Login with username/password
- `POST /api/logout` - End session
- `GET /api/user` - Get current authenticated user

**Onboarding (3 Pillars):**
- `POST /api/onboarding/purpose` - Save 3 purpose prompts, get AI-generated summary
- `POST /api/onboarding/method` - Save workstyle profile

**Network Pillar:**
- `GET /api/key-people` - Get user's key people
- `POST /api/key-people` - Add a key person
- `POST /api/key-people/bulk` - Add multiple key people
- `PUT /api/key-people/:id` - Update a key person
- `DELETE /api/key-people/:id` - Remove a key person

**Goals & Tasks:**
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create a goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

**AI Generation:**
- `POST /api/ai/generate-goals` - Generate goals from purpose summary (auto-creates in DB)
- `POST /api/ai/generate-milestones` - Generate milestones from goal (auto-creates as tasks in DB)
- `POST /api/ai/analyze-check-in` - Analyze check-in and provide insights with network nudges

**Reflections:**
- `GET /api/reviews` - Get all weekly reviews
- `POST /api/reflections/submit` - Submit weekly check-in

---

## Common Errors & Solutions

### Error 1: "Attempted to navigate before mounting the Root Layout"
**File:** `/app/index.tsx`
**Cause:** Using `useRouter().replace()` too early in component lifecycle
**Fix:** Use `<Redirect>` component with delay instead of imperative navigation

**IMPORTANT FIX - Always use this pattern:**
```typescript
const [ready, setReady] = useState(false);
useEffect(() => {
  if (!isLoading) {
    setTimeout(() => setReady(true), 100);
  }
}, [isLoading]);

if (!ready || isLoading) {
  return <ActivityIndicator />;
}

// Use declarative Redirect, NOT useRouter().replace()
return <Redirect href="/(tabs)" />;
```

### Error 2: Tab icons not rendering
**File:** `/app/(tabs)/_layout.tsx`
**Cause:** Using HTML elements like `<span>` instead of React Native components
**Fix:** Use `<Text>` from 'react-native'

**IMPORTANT FIX:**
```typescript
import { Platform, Text } from 'react-native'; // Import Text

const TabBarIcon = ({ name, color }: { name: string; color: string }) => {
  const icons: Record<string, string> = {
    index: '🏠',
    goals: '🎯',
    tasks: '✓',
    reflections: '📝',
    profile: '👤',
  };
  // Use Text, NOT span
  return <Text style={{ fontSize: 24 }}>{icons[name] || '•'}</Text>;
};
```

### Error 3: Dependency conflicts during npm install
**Cause:** Peer dependency version mismatches
**Fix:** Use `npm install --legacy-peer-deps`

### Error 4: Database schema out of sync
**Cause:** Schema changes not pushed to database
**Fix:** Run `npm run db:push` from project root

### Error 5: Mobile app not connecting to backend
**Troubleshooting:**
1. Check MOCK_MODE is set to `false` in both auth-store.ts and api.ts
2. Verify API_BASE_URL points to correct IP:port
3. Ensure backend is running (`npm run dev` from root)
4. Check firewall allows connections on port 5000
5. Use `ngrok` if testing on physical device outside local network

**Update API_BASE_URL:**
```typescript
// In /lib/api.ts
const API_BASE_URL = __DEV__
  ? 'http://YOUR_COMPUTER_IP:5000'  // Use your local IP for physical devices
  : 'https://your-production-api.com';
```

**To find your local IP:**
- Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Windows: `ipconfig`
- Linux: `ip addr show`

### Error 6: AI features not working
**Troubleshooting:**
1. Check at least one API key is set in `.env`
2. Verify API key is valid (not expired)
3. Check backend logs for AI errors
4. AI functions have fallbacks - should never crash completely

---

## Important Implementation Notes

### Onboarding Flow (3 Pillars)
1. **Purpose Pillar** (`/(onboarding)/purpose.tsx`):
   - User answers 3 micro-prompts about their career vision
   - Frontend calls `POST /api/onboarding/purpose`
   - Backend uses Claude to generate a 1-paragraph synthesis (`purposeSummary`)
   - Summary is saved to user profile and displayed to user

2. **Method Pillar** (`/(onboarding)/method.tsx`):
   - User selects workstyle preferences (multiple choice + free text)
   - Frontend calls `POST /api/onboarding/method`
   - Saves `workstyleBest` and `workstyleStuck` to user profile

3. **Network Pillar** (`/(onboarding)/key-people.tsx`):
   - User adds 3 key relationships (mentor, peer, collaborator)
   - Frontend calls `POST /api/key-people/bulk`
   - Each person includes: name, type, why they matter, last interaction date

4. **Goal Generation** (`/(onboarding)/goals.tsx`):
   - User triggers AI goal generation
   - Frontend calls `POST /api/ai/generate-goals` with `purposeSummary`
   - Claude generates 3-4 goals aligned with user's purpose
   - Goals auto-created in database with `aiGenerated: 1`
   - User reviews and can edit/delete before completing onboarding

### AI Milestone Generation Flow
1. User selects a goal and requests milestones
2. Frontend calls `POST /api/ai/generate-milestones` with `goalId`
3. Backend uses Claude to break down goal into actionable milestones
4. Milestones created as tasks with `aiGenerated: 1` and `recommendedSchedule`
5. Frontend displays milestones with schedule recommendations

### Check-In Analysis Flow
1. User submits weekly check-in (wins, lessons, next steps)
2. Frontend calls `POST /api/reflections/submit`
3. Backend saves to `weeklyReviews` table
4. Frontend can call `POST /api/ai/analyze-check-in` separately
5. Claude analyzes check-in and returns:
   - Insights about progress and patterns
   - Recommendations for next steps
   - **Network nudges** - reminders to connect with key people based on last interaction dates
6. Analysis displayed to user (not currently stored)

---

## Key Files Reference

### Mobile App Core Files
- `/app/_layout.tsx` - Root layout with providers
- `/app/index.tsx` - Entry point with routing logic (⚠️ USES REDIRECT PATTERN)
- `/app/(tabs)/_layout.tsx` - Tab navigation (⚠️ USES TEXT FOR ICONS)
- `/lib/auth-store.ts` - Authentication state (HAS MOCK MODE)
- `/lib/api.ts` - API client and endpoints (HAS MOCK MODE)
- `/assets/` - Mobile app assets (icons, splash screens)

### Backend Core Files
- `/server/index.ts` - Express server entry point
- `/server/routes.ts` - Route registration hub
- `/server/lib/ai-mvp.ts` - **CURRENT AI SERVICE** - Claude integration for MVP
- `/server/lib/auth.ts` - Passport.js authentication (scrypt)
- `/server/lib/storage.ts` - Database queries (Drizzle ORM)
- `/server/lib/scheduler.ts` - Background cron jobs
- `/server/db.ts` - Database connection (Neon PostgreSQL)
- `/server/routes/onboarding.ts` - **Purpose & Method Pillar** endpoints (Router-based)
- `/server/routes/key-people.ts` - **Network Pillar** endpoints (Router-based)
- `/server/routes/ai.ts` - AI generation endpoints (function-based)
- `/server/routes/goals.ts` - Goal management endpoints (function-based)
- `/server/routes/tasks.ts` - Task management endpoints (function-based)
- `/server/routes/reflections.ts` - Check-in endpoints (function-based)
- `/server/routes/connections.ts` - Legacy connections (function-based)

**Deprecated/Legacy Files:**
- `/server/lib/ai.ts` - Old AI service (deprecated)
- `/server/lib/ai-mobile/` - Old week-based AI implementation (deprecated)
- `/server/lib/opus-framework.ts` - Old 5-week program structure (deprecated)
- `/server/routes/program.ts` - Old program management (deprecated)

### Shared Files
- `/shared/schema.ts` - Database schema and Zod validation
- `/drizzle.config.ts` - Database migration configuration

### Documentation
- `/CLAUDE.md` - This file (main developer guide)
- `/docs/README.md` - Documentation index
- `/docs/opus-framework-5-pillars.md` - Core philosophy (3 pillars)
- `/docs/roadmap.md` - Project vision and future plans
- `/docs/technical/architecture.md` - System architecture
- `/docs/technical/api_endpoints.md` - API reference
- `/docs/technical/mobile-mvp-plan.md` - Mobile implementation guide
- `/docs/technical/setup_guide.md` - Development setup
- `/docs/design/design-system-reference.md` - UI/UX guidelines
- `/scripts/README.md` - Documentation for all helper scripts

---

## What's Pending for the App to Function

The app has two modes:

### MOCK MODE (Currently Active - Mobile Works Now) ✅
- ✅ Mobile app fully functional with mock data
- ✅ All screens built and navigable
- ✅ Can test entire user flow without backend
- ✅ Login with any credentials works
- ✅ Onboarding flow works
- ✅ All tabs display data

**To Test:** Just run `npm start` then press `i` for iOS (no need to cd into mobile directory).

### PRODUCTION MODE (Pending) ⚠️
To make the app work with real backend:

1. **Set up environment variables**
   Create `.env` in project root:
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/database
   SESSION_SECRET=your_random_secret_here
   ANTHROPIC_API_KEY=sk-ant-xxx  # REQUIRED for AI features
   ```

2. **Push database schema changes**
   ```bash
   npm run db:push
   ```

3. **Start backend server**
   ```bash
   npm run dev  # Runs on port 5000
   ```

4. **Update mobile app configuration**
   - In `/lib/api.ts`: Set `MOCK_MODE = false` and update `API_BASE_URL` to your computer's IP
   - In `/lib/auth-store.ts`: Set `MOCK_MODE = false`

5. **Test the full flow**
   - Register → Purpose → Method → Network → AI Goals → Milestones

---

## Recent Changes & Fixes

**December 2025 - Refactored to 3-Pillar MVP:**
- ✅ Simplified from 5-week program to 3-pillar onboarding (Purpose, Method, Network)
- ✅ Created new AI service (`server/lib/ai-mvp.ts`) with Claude Sonnet 4.5
- ✅ Added Purpose Pillar: 3 micro-prompts → AI synthesis
- ✅ Added Method Pillar: Workstyle profile questions
- ✅ Added Network Pillar: Track 3 key people (mentor, peer, collaborator)
- ✅ Updated schema with new fields (purposePrompt1-3, purposeSummary, workstyleBest, workstyleStuck)
- ✅ Added `keyPeople` table and routes for Network Pillar
- ✅ Created full onboarding flow screens in mobile app
- ✅ Deprecated old week-based AI service and program management

**November 2025 - Mobile-First Restructure:**
- ✅ Moved mobile app to root level (app/, lib/, assets/)
- ✅ Removed deprecated web app (client/)
- ✅ Merged package.json files for simplified dependency management
- ✅ Fixed navigation error (useRouter → Redirect pattern)
- ✅ Fixed tab icon error (span → Text component)
- ✅ Implemented MOCK_MODE for testing without backend

**Key Files in Current Implementation:**
- **Active**: `server/lib/ai-mvp.ts`, `server/routes/onboarding.ts`, `server/routes/key-people.ts`
- **Deprecated**: `server/lib/ai-mobile/`, `server/lib/opus-framework.ts`, `server/routes/program.ts`

---

## Summary for New Claude Instances

This is a **mobile-first professional transformation tool** called Opus, built around **3 foundational pillars**:

1. **Mobile app** (React Native + Expo) - Primary user interface (✅ WORKING IN MOCK MODE)
2. **Backend API** (Express + PostgreSQL) - RESTful API (✅ FULLY BUILT)
3. **AI Service** - Claude Sonnet 4.5 for purpose synthesis, goal generation, and check-in analysis (✅ FULLY BUILT)

**The 3 Pillars Framework:**
- **Purpose** 🎯 - 3 micro-prompts → AI-generated summary of career vision
- **Method** 🔧 - Workstyle profile (how you work best, what gets you stuck)
- **Network** 🌐 - Track 3 key people (mentor, peer, collaborator) with interaction dates

**The mobile app is currently FULLY FUNCTIONAL in MOCK_MODE** - all screens work, all flows tested, ready for real backend integration.

**To make it work with real backend:** See "What's Pending for the App to Function" section above.

**Key principles:**
- ⚠️ Mobile app is at root level (/app, /lib, /assets) - not in /mobile directory
- ⚠️ Use `<Redirect>` not `useRouter().replace()` for initial navigation in `/app/index.tsx`
- ⚠️ Use `<Text>` not `<span>` for React Native components
- ⚠️ Current AI service is in `/server/lib/ai-mvp.ts` (NOT the deprecated ai-mobile/ directory)
- All database queries MUST be user-scoped for data isolation
- AI-generated content uses integer flags: `aiGenerated: 1` (not boolean `true`)
- Schema changes require `npm run db:push`
- MOCK_MODE allows testing without backend
- Single package.json at root with all dependencies merged
