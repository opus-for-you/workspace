# Opus Mobile MVP

React Native mobile app for the Opus 5-week transformation program.

## Running the App

### 1. Install Dependencies (if not already done)
```bash
cd mobile
npm install
```

### 2. Start the Development Server
```bash
npm start
```

This will start the Expo development server and show a QR code.

### 3. Run on Device/Simulator

**Option A: Physical Device (Recommended for testing)**
1. Install "Expo Go" app on your phone:
   - iOS: Download from App Store
   - Android: Download from Google Play Store
2. Scan the QR code from the terminal using:
   - iOS: Camera app
   - Android: Expo Go app

**Option B: iOS Simulator (Mac only)**
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

## Current Status

### ✅ Completed
- Project setup with Expo + TypeScript
- Authentication screens (Login/Register)
- Onboarding flow (North Star + Program Intro)
- Main tab navigation (Dashboard, Goals, Tasks, Reflections, Profile)
- All UI screens built and functional

### ⚠️ Not Yet Connected
- **Backend API endpoints** - Need to be created
- **AI Service** - Opus Framework integration needed
- **Database** - Schema updated but not pushed

The UI is fully functional but will show mock/empty states until the backend is connected.

## Next Steps

1. **Backend Setup**
   - Create API endpoints for auth, onboarding, program, AI generation
   - Enhance AI service with Opus Framework
   - Push database schema changes

2. **Connect Mobile to Backend**
   - Update API base URL in `lib/api.ts` (currently localhost)
   - Implement auth flow (currently throws error)
   - Test all screens with real data

3. **Testing**
   - Test authentication flow
   - Test north star onboarding
   - Test AI goal generation
   - Test week progression

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/          # Login & Register
│   ├── (onboarding)/    # North Star & Program Intro
│   ├── (tabs)/          # Main app (Dashboard, Goals, Tasks, etc.)
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Entry point & routing logic
├── lib/
│   ├── api.ts           # API client & endpoints
│   ├── auth-store.ts    # Zustand auth state
│   └── (other libs)
├── components/          # Reusable components (future)
└── constants/           # Constants (future)
```

## Notes

- Uses Expo Router for file-based navigation
- Uses TanStack Query for server state management
- Uses Zustand for local auth state
- Color scheme: #5A7F6A (sage green), #FAFAF5 (cream), #2C2C2C (charcoal)
