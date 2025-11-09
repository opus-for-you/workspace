# Opus Mobile App MVP - Implementation Plan

## Project Overview
Build a React Native mobile app (iOS & Android) with a 5-week guided program combining AI-powered goal setting, task management, and weekly reflections.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Initialize React Native Project
- Create new Expo managed workflow project with TypeScript
- Install core dependencies:
  - `expo-router` (file-based navigation)
  - `@tanstack/react-query` (server state - reuse from web)
  - `react-hook-form` + `zod` (forms & validation - reuse schemas)
  - `nativewind` (TailwindCSS for React Native)
  - `zustand` (local state for program progress)
  - `react-native-mmkv` (fast local storage)

### 1.2 Backend Enhancements
- **Add to `shared/schema.ts`:**
  - `northStar` field to users table (text, nullable)
  - `programWeek` field to users table (integer, default 0)
  - `programStartDate` field to users table (timestamp, nullable)
  - Extend `goals` table with `aiGenerated` boolean and `weekNumber` fields
  - Extend `tasks` table with `recommendedSchedule` field and `aiGenerated` boolean

- **New API Endpoints (`server/routes/`):**
  - `POST /api/onboarding/north-star` - Save north star vision
  - `POST /api/program/start` - Initialize 5-week program
  - `GET /api/program/current-week` - Get current program week & progress
  - `POST /api/ai/generate-goals` - AI goal generation (enhanced)
  - `POST /api/ai/generate-tasks` - AI task generation with schedule
  - `POST /api/ai/refine-goals` - Refine based on reflections
  - `POST /api/reflections/submit` - EOW reflection with AI analysis

### 1.3 AI Service Enhancement (`server/lib/ai.ts`)
- Create Opus Framework reference system (purpose, rhythm, network, structure, methods)
- Implement week-specific AI prompts for each program phase
- Build reflection analysis engine that informs future recommendations
- Add goal/task refinement based on user progress

---

## Phase 2: Core Mobile UI

### 2.1 Authentication & Onboarding Flow
**Screens:**
- `app/(auth)/login.tsx` - Login screen
- `app/(auth)/register.tsx` - Registration
- `app/(onboarding)/north-star.tsx` - North star identification (single question, focused)
- `app/(onboarding)/program-intro.tsx` - Explain 5-week program

**Features:**
- Secure token storage (expo-secure-store)
- Biometric authentication (expo-local-authentication)
- Smooth animated transitions between onboarding steps

### 2.2 Main App Navigation
**Tab Structure:**
- Dashboard (Home)
- Goals
- Tasks
- Reflections
- Profile/Settings

**Screens:**
- `app/(tabs)/dashboard.tsx` - Week progress, upcoming tasks, current focus
- `app/(tabs)/goals.tsx` - Goal list with progress bars, AI suggestions
- `app/(tabs)/tasks.tsx` - Task list with recommended schedule
- `app/(tabs)/reflections.tsx` - Weekly reflection history
- `app/(tabs)/profile.tsx` - Settings, program progress

### 2.3 Shared Components
- `WeekProgressIndicator` - Visual 5-week progress bar
- `AIGoalCard` - Display AI-generated goal suggestions
- `TaskScheduleCard` - Task with recommended time/day
- `ReflectionPrompt` - Guided reflection questions
- `ProgramPhaseHeader` - Current week theme indicator

---

## Phase 3: 5-Week Program Logic

### 3.1 Program State Management
**Create `lib/program.ts`:**
- Calculate current program week based on start date
- Determine if EOW reflection is due
- Track week completion status
- Handle week transitions

### 3.2 Week-Specific Content
**Create `constants/program-weeks.ts`:**
```typescript
Week 1: Purpose - "Define your north star"
  - Focus: Clarifying vision and identifying meaningful work
  - AI prompts: Values-based goal generation

Week 2: Rhythm - "Build your cadence"
  - Focus: Daily habits and consistent practices
  - AI prompts: Routine-based task scheduling

Week 3: Network - "Strengthen connections"
  - Focus: Relationship building and mentorship
  - AI prompts: Connection-oriented goals

Week 4: Structure - "Design your systems"
  - Focus: Frameworks and processes
  - AI prompts: System-building tasks

Week 5: Methods - "Refine your approach"
  - Focus: Techniques and optimization
  - AI prompts: Skill development goals
```

### 3.3 AI Integration Points
- **Onboarding**: Generate Week 1 goals from north star
- **Daily**: Suggest 3-5 tasks with recommended schedule
- **End of Week**: Analyze reflection, refine goals/tasks for next week
- **Week Transition**: Generate week-specific goals based on Opus Framework

---

## Phase 4: AI-Powered Features

### 4.1 North Star → Goal Generation
**Flow:**
1. User inputs north star vision
2. AI analyzes using Opus Framework (Week 1: Purpose)
3. Generate 3-5 initial goals with categories
4. User reviews, accepts, or modifies

**Implementation:**
- Enhance `server/lib/ai.ts::generateGoalSuggestions`
- Add `programWeek` parameter to context
- Reference Opus Framework principles in prompts

### 4.2 Goal → Task Generation
**Flow:**
1. User selects a goal
2. AI breaks down into actionable tasks
3. AI recommends schedule (time of day, day of week)
4. User confirms or adjusts

**New Function:**
- `server/lib/ai.ts::generateTasksFromGoal(goal, userContext, programWeek)`

### 4.3 Reflection Analysis & Refinement
**Flow:**
1. User completes EOW reflection (wins, lessons, challenges)
2. AI analyzes patterns and progress
3. AI refines existing goals or suggests new ones
4. AI adjusts task recommendations for next week

**New Functions:**
- `server/lib/ai.ts::analyzeReflection(reflection, goals, tasks)`
- `server/lib/ai.ts::refineGoalsFromReflection(analysis, currentGoals, nextWeek)`

---

## Phase 5: MVP Features Completion

### 5.1 Dashboard Implementation
**Components:**
- Current week indicator (1-5)
- Week theme display (Purpose, Rhythm, etc.)
- Today's recommended tasks (3-5)
- Progress toward this week's goals
- Quick add task button
- Reflection reminder (if EOW)

### 5.2 Goals Screen
**Features:**
- List all goals grouped by week/category
- Visual progress indicators (0-100%)
- AI suggestion cards at top
- Tap to see associated tasks
- Mark goal complete
- Edit/delete goals

### 5.3 Tasks Screen
**Features:**
- Daily view with recommended schedule
- "Morning", "Afternoon", "Evening" sections
- Swipe to complete
- Filter: Today, This Week, All
- Mark as done with satisfaction check-in
- Link tasks to goals

### 5.4 Reflections Screen
**Features:**
- EOW reflection form (wins, lessons, next focus)
- AI-generated reflection prompts
- History of past reflections
- Visual week completion celebration

### 5.5 Profile/Settings
- Program progress visualization
- Current week: X/5
- Notification preferences
- Theme toggle
- Logout

---

## Phase 6: Polish & Testing

### 6.1 UI/UX Refinements
- Loading states for AI generation
- Smooth animations (React Native Reanimated)
- Error handling & retry mechanisms
- Empty states with helpful CTAs
- Haptic feedback on interactions

### 6.2 Offline Support
- Cache goals and tasks locally (React Query + MMKV)
- Queue mutations when offline
- Sync when connection restored

### 6.3 Testing
- Test authentication flow
- Test AI generation edge cases
- Test program week transitions
- Test reflection submission
- Test offline behavior

---

## Phase 7: Deployment Preparation

### 7.1 Build Configuration
- Configure app.json (name, bundle IDs, icons)
- Create app icon and splash screen
- Set up EAS Build for iOS and Android
- Configure environment variables

### 7.2 Beta Testing
- TestFlight (iOS) setup
- Google Play Internal Testing (Android)
- Recruit 10-20 beta testers
- Gather feedback and iterate

### 7.3 Final Polish
- Fix reported bugs
- Optimize AI prompts based on feedback
- Performance optimization
- Prepare App Store assets (screenshots, descriptions)

---

## Technical Architecture Decisions

### Reuse from Web App
✅ **Reuse:**
- Entire Express backend (no changes needed initially)
- Database schema (with additions)
- Zod validation schemas
- AI service logic (with enhancements)
- API contracts and types

❌ **Don't Reuse:**
- React web components (rebuild with React Native)
- TailwindCSS classes (use NativeWind equivalent)
- React Router (use Expo Router)

### New Mobile-Specific Tech
- **Expo Router**: File-based navigation
- **NativeWind**: TailwindCSS for React Native
- **Zustand**: Program state management
- **MMKV**: Fast local storage
- **Expo SecureStore**: Token storage
- **Expo Local Authentication**: Biometric auth
- **React Native Reanimated**: Smooth animations

---

## Key Differences from Web App

### Focus Shift
- **Web**: Multi-feature productivity suite (goals, tasks, connections, reviews)
- **Mobile MVP**: Focused 5-week guided program with AI coaching

### Features Removed for MVP
- ❌ Connections management (Week 3 will have connection goals instead)
- ❌ Kanban board view (simple list only)
- ❌ Complex filtering/sorting
- ❌ Dashboard analytics charts

### Features Added for MVP
- ✅ North star onboarding (instead of 3-question)
- ✅ 5-week structured program
- ✅ AI-generated task scheduling
- ✅ Reflection-based goal refinement
- ✅ Week-specific themes and prompts
- ✅ Mobile-optimized daily task view

---

## MVP Feature Requirements Checklist

Based on your requirements document:

### Core Features
- [x] Mobile app (iPhone and Android) - React Native + Expo
- [x] Onboarding "north star" identification - Single focused question
- [x] AI-generated/guided goal setting - Using Anthropic Claude
- [x] AI-generated/guided action items - Task generation with schedule
- [x] EOW reflection (informs AI recommendations) - Analysis engine
- [x] Dashboard - Week progress, tasks, current focus
- [x] Goals - AI-generated and user goals with progress
- [x] Tasks - With recommended schedule
- [x] Weekly reflections - EOW submission with AI analysis

### 5-Week Program Structure
- [x] Week 1: Purpose - North star and vision clarification
- [x] Week 2: Rhythm - Daily habits and cadence
- [x] Week 3: Network - Connections and relationships
- [x] Week 4: Structure - Systems and frameworks
- [x] Week 5: Methods - Techniques and refinement

### AI Opus Framework Integration
- [x] AI references Opus Framework in analyzing user input
- [x] AI refines goals/tasks as needed based on reflections
- [x] Week-specific prompts aligned with framework themes

---

## Next Steps to Start
1. Create new Expo project in `/mobile` directory
   ```bash
   npx create-expo-app@latest mobile --template expo-template-blank-typescript
   cd mobile
   npx expo install expo-router react-native-safe-area-context react-native-screens
   ```

2. Install core dependencies
   ```bash
   npm install @tanstack/react-query zustand react-native-mmkv
   npm install nativewind tailwindcss
   npm install react-hook-form zod
   npm install expo-secure-store expo-local-authentication
   ```

3. Update database schema in `shared/schema.ts`
   - Add northStar, programWeek, programStartDate to users
   - Add aiGenerated, weekNumber to goals
   - Add recommendedSchedule, aiGenerated to tasks

4. Create initial API endpoints
   - Start with `/api/onboarding/north-star`
   - Then `/api/program/start`

5. Build proof of concept flow
   - North star onboarding screen
   - AI goal generation from north star
   - Display generated goals
   - Simple task list

### First Milestone
Have a working flow: User enters north star → AI generates goals → User sees goals on mobile app

---

## Questions to Resolve

### Product Questions
1. **Opus Framework Content**: Do you have detailed content for each week's theme, or should we create it?
2. **Reflection Frequency**: Strictly EOW only, or allow mid-week check-ins?
3. **Program Restart**: Can users restart the 5-week program, or is it one-time only?
4. **Task Scheduling**: Should AI consider user's time zone and preferences?

### Technical Questions
1. **Backend URL**: Where will the Express backend be hosted for mobile to connect?
2. **Authentication**: Session-based won't work for mobile - switch to JWT tokens?
3. **AI Provider**: Prefer Anthropic Claude or OpenAI for goal/task generation?
4. **Push Notifications**: Required for MVP or can be deferred?

---

## Success Metrics

### Technical Metrics
- App loads in < 2 seconds
- AI goal generation completes in < 5 seconds
- 95%+ uptime for API
- Offline mode works seamlessly

### User Metrics
- 80%+ complete north star onboarding
- 60%+ complete Week 1
- 40%+ reach Week 5
- 70%+ submit at least one reflection

### AI Quality Metrics
- Users accept 70%+ of AI-generated goals
- Users accept 60%+ of AI-generated tasks
- Reflection analysis feels personalized and helpful

---

**Ready to start building when you confirm!** 🚀
