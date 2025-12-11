# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Opus** is a 5-week professional transformation program with both web and mobile applications. The system uses AI (Claude + OpenAI) to generate personalized goals, tasks, and reflections based on the user's "north star" vision and current program week.

### The Opus Framework

The core of this application is a **5-week transformation program**. Each week has a specific theme and coaching approach:

1. **Week 1: Purpose** 🎯 - Clarifying vision and identifying meaningful work
2. **Week 2: Rhythm** ⚡ - Building daily habits and consistent practices
3. **Week 3: Network** 🌐 - Strengthening connections and building relationships
4. **Week 4: Structure** 🏗️ - Designing systems and frameworks
5. **Week 5: Methods** 🔧 - Refining techniques and optimizing approach

**Framework Implementation:** `/server/lib/opus-framework.ts`

Each week includes:
- Theme and focus area
- AI prompt guidance for goal generation
- AI prompt guidance for task generation
- Reflection prompts
- Specific coaching philosophy

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
- `users` - User accounts with onboarding data (vision, energy, direction, northStar)
- `connections` - Professional relationships and contacts
- `goals` - Personal/professional objectives (supports AI-generated goals with `aiGenerated` flag)
- `tasks` - Task management with goal associations (supports AI-generated tasks)
- `weeklyReviews` - Weekly reflection entries

**Important**: The schema uses integer flags (0/1) instead of booleans for `aiGenerated` fields to ensure PostgreSQL compatibility.

### Storage Layer (`server/storage.ts`)
Implements `IStorage` interface for all CRUD operations. All queries are user-scoped for data isolation. Uses Drizzle ORM with PostgreSQL connection pooling.

### API Layer (`server/routes.ts` and `server/routes/*.ts`)
RESTful endpoints with modular route files:
- Main routes in `server/routes.ts` (auth, user)
- Feature routes in `server/routes/` (connections, goals, tasks, reflections, ai, onboarding)
- All protected routes use `requireAuth` middleware
- Request validation using Zod schemas from shared schema

### Authentication (`server/auth.ts`)
- Passport.js with local strategy
- Password hashing using **scrypt** (not bcrypt) with salt
- Session-based auth with PostgreSQL session store (connect-pg-simple)
- Sessions persist across server restarts

### AI Integration

**Mobile MVP AI Service** (`server/lib/ai-mobile/`):
The app uses a **hybrid AI approach** with intelligent fallbacks and week-specific implementations:

**Claude (Anthropic)** - Primary for coaching/empathy:
- Goal generation from north star vision (`generateGoalsFromNorthStar()`)
- Reflection analysis and insights (`analyzeReflection()`)
- Personalized guidance and recommendations

**OpenAI (GPT-4)** - Primary for structured tasks:
- Task decomposition from goals (`generateTasksFromGoal()`)
- Scheduling recommendations
- Time estimation

**Fallback System:**
1. Try primary AI provider
2. If fails, try secondary provider
3. If both fail, return sensible default suggestions

**Week-Specific AI Modules** (`server/lib/ai-mobile/`):
Each week has dedicated AI implementations:
- `purpose.ts` - Week 1: Goal/task generation for clarity and vision
- `rhythm.ts` - Week 2: Goal/task generation for habits and consistency
- `network.ts` - Week 3: Goal/task generation for relationships
- `structure.ts` - Week 4: Goal/task generation for systems
- `methods.ts` - Week 5: Goal/task generation for optimization
- `shared.ts` - Shared utilities and AI wrapper functions
- `index.ts` - Router that delegates to week-specific modules

**Web AI Service** (`server/lib/ai.ts`):
- Legacy implementation (deprecated)
- Two main functions: `generateGoalSuggestions()` and `generateReflectionPrompt()`

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
│   ├── login.tsx
│   └── register.tsx
├── (onboarding)/         # Onboarding group (stack)
│   ├── north-star.tsx
│   └── program-intro.tsx
└── (tabs)/               # Main app (tabs) ⚠️ USES TEXT FOR ICONS
    ├── _layout.tsx       # Tab navigation
    ├── index.tsx         # Dashboard
    ├── goals.tsx         # Goals screen
    ├── tasks.tsx         # Tasks screen
    ├── reflections.tsx   # Reflections screen
    └── profile.tsx       # Profile screen
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

### Mobile MVP Fields
The schema includes mobile-specific fields for a 5-week onboarding program:
- `users.northStar` - User's ultimate professional vision
- `users.programWeek` - Current week (0-5)
- `users.programStartDate` - Program start timestamp
- `goals.weekNumber` - Which week the goal belongs to (1-5)
- `tasks.recommendedSchedule` - AI-suggested timing

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

# Optional (AI features won't work without these)
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...
```

## Database Configuration

Uses Neon serverless PostgreSQL. Connection pooling configured in `server/db.ts`. Drizzle Kit config in `drizzle.config.ts` points to `shared/schema.ts`.

## Build and Deployment

- Web build: Vite for frontend, esbuild for backend
- Production serves static frontend from Express
- Server always runs on port specified in `PORT` env var (default 5000)
- Graceful shutdown handlers for SIGTERM/SIGINT

## Mobile-Web API Sharing

The Express backend serves both web and mobile clients. Mobile app makes HTTP requests to the same API endpoints. Ensure authentication works cross-platform (session cookies for web, token/header auth may be needed for mobile in future).

### Mobile MVP API Endpoints

**Onboarding:**
- `POST /api/onboarding/north-star` - Save user's north star vision

**Program Management:**
- `POST /api/program/start` - Initialize 5-week program (sets week to 1)
- `GET /api/program/current-week` - Get current week, theme, and progress
- `POST /api/program/advance-week` - Manually advance to next week (testing)

**AI Generation:**
- `POST /api/ai/generate-goals` - Generate goals from north star (auto-creates in DB)
- `POST /api/ai/generate-tasks` - Generate tasks from goal (auto-creates in DB)
- `POST /api/ai/refine-goals` - Analyze reflection and get insights

**Reflections:**
- `POST /api/reflections/submit` - Submit reflection with AI analysis

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

### Week Progression Logic
- Program starts when user hits "Start Program" (week becomes 1)
- Week automatically advances every 7 days based on `programStartDate`
- Current week calculated in `/server/routes/program.ts`:
  ```typescript
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const calculatedWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 5);
  ```

### AI Goal Generation Flow
1. User completes north star input
2. Frontend calls `POST /api/ai/generate-goals`
3. Backend fetches Opus Framework guidance for current week
4. Claude generates 3-4 goals aligned with week theme
5. Goals auto-created in database with `aiGenerated: 1` and `weekNumber`
6. Frontend displays goals with AI badge

### AI Task Generation Flow
1. User selects a goal and requests tasks
2. Frontend calls `POST /api/ai/generate-tasks`
3. Backend uses GPT-4o-mini to break down goal
4. Tasks include recommended scheduling (morning/afternoon/evening)
5. Tasks auto-created in database with `aiGenerated: 1`
6. Frontend displays tasks with schedule recommendations

### Reflection Analysis Flow
1. User submits weekly reflection (wins, lessons, next steps)
2. Backend saves reflection to database
3. Claude analyzes reflection in background
4. Returns patterns, insights, and recommendations
5. (Currently not stored - future enhancement)

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
- `/server/lib/opus-framework.ts` - 5-week program structure
- `/server/lib/ai-mobile/` - Week-specific AI implementations (directory)
  - `index.ts` - AI router
  - `purpose.ts`, `rhythm.ts`, `network.ts`, `structure.ts`, `methods.ts` - Week modules
  - `shared.ts` - Shared AI utilities
- `/server/lib/ai.ts` - Legacy AI service (deprecated)
- `/server/lib/auth.ts` - Passport.js authentication (scrypt)
- `/server/lib/storage.ts` - Database queries (Drizzle ORM)
- `/server/lib/scheduler.ts` - Background cron jobs
- `/server/routes/program.ts` - Program management endpoints
- `/server/routes/onboarding.ts` - Onboarding endpoints
- `/server/routes/ai.ts` - AI generation endpoints
- `/server/routes/reflections.ts` - Reflection endpoints with AI analysis

### Shared Files
- `/shared/schema.ts` - Database schema and Zod validation
- `/drizzle.config.ts` - Database migration configuration

### Documentation
- `/CLAUDE.md` - This file (main developer guide)
- `/docs/README.md` - Documentation index
- `/docs/opus-framework-5-pillars.md` - Core philosophy
- `/docs/roadmap.md` - Project vision and future plans
- `/docs/technical/architecture.md` - System architecture
- `/docs/technical/api_endpoints.md` - API reference
- `/docs/technical/mobile-mvp-plan.md` - Mobile implementation
- `/docs/technical/setup_guide.md` - Development setup
- `/docs/design/design-system-reference.md` - UI/UX guidelines

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
   ANTHROPIC_API_KEY=sk-ant-xxx  # At least ONE AI key required
   OPENAI_API_KEY=sk-xxx         # Recommended for best results
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
   - Register → North Star → Program Start → AI Goals → Tasks

---

## Recent Changes & Fixes

**November 2025 - Mobile MVP Implementation:**
- ✅ Created complete mobile app with all screens
- ✅ Built Opus Framework with 5-week program structure
- ✅ Enhanced AI service with Claude + OpenAI hybrid approach
- ✅ Added 7 new API endpoints for mobile features
- ✅ Updated database schema with mobile-specific fields
- ✅ Fixed navigation error (useRouter → Redirect pattern)
- ✅ Fixed tab icon error (span → Text component)
- ✅ Implemented mock mode for testing without backend
- ✅ Created comprehensive documentation

**November 2025 - Mobile-First Restructure:**
- ✅ Moved mobile app to root level (app/, lib/, assets/)
- ✅ Removed deprecated web app (client/)
- ✅ Merged package.json files for simplified dependency management
- ✅ Updated tsconfig.json to include both mobile and backend
- ✅ Single `npm start` command now runs mobile app

**Files Modified/Created:**
- Created: `server/lib/opus-framework.ts`, `server/lib/ai-mobile/` (directory with week modules), `server/routes/program.ts`
- Modified: `server/routes/onboarding.ts`, `server/routes/ai.ts`, `server/routes/reflections.ts`, `server/routes.ts`, `shared/schema.ts`
- Mobile: Entire mobile app now at root level (/app, /lib, /assets)

**Total Lines of Code Added:** ~1,200+ lines

---

## Summary for New Claude Instances

This is a **mobile-first application** for a 5-week professional transformation program called Opus. It has:

1. **Mobile app** (React Native + Expo) - Primary user interface (✅ WORKING IN MOCK MODE)
2. **Backend API** (Express + PostgreSQL) - RESTful API (✅ FULLY BUILT)
3. **AI Service** - Claude + OpenAI hybrid with week-specific modules (✅ FULLY BUILT)
4. **Web app** - Deprecated/removed (focus is mobile-first)

**The mobile app is currently FULLY FUNCTIONAL in MOCK_MODE** - all screens work, all flows tested, ready for real backend integration.

**To make it work with real backend:** See "What's Pending for the App to Function" section above.

**Key principles:**
- ⚠️ Mobile app is at root level (/app, /lib, /assets) - not in /mobile directory
- ⚠️ Use `<Redirect>` not `useRouter().replace()` for initial navigation in `/app/index.tsx`
- ⚠️ Use `<Text>` not `<span>` for React Native components
- Opus Framework defines week-specific AI coaching
- All AI functions have graceful fallbacks
- Schema changes require `npm run db:push`
- MOCK_MODE allows testing without backend
- Single package.json at root with all dependencies merged
