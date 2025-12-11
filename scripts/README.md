# Opus Development Scripts

This directory contains helpful scripts to make development easier, especially for non-technical users.

## Quick Start (Recommended for New Developers)

```bash
npm run quick-start
```

This interactive script will:
1. Install all dependencies (backend + mobile)
2. Create `.env` template
3. Run health checks
4. Guide you through starting the app

## Available Scripts

### 🚀 Setup & Installation

#### `npm run setup`
**Initial setup for new developers**

- Checks Node.js version (requires 20+)
- Installs backend dependencies
- Installs mobile dependencies
- Creates `.env` template if it doesn't exist
- Shows next steps

**When to use:** First time setting up the project

---

#### `npm run health-check`
**Verify your development environment**

Checks:
- ✅ Node.js and npm versions
- ✅ Dependencies installed
- ✅ `.env` file exists and configured
- ✅ Database URL set
- ✅ API keys configured
- ✅ TypeScript compilation

**When to use:**
- After running setup
- When something isn't working
- Before starting development

---

### 🏃 Running the App

#### `npm run start:backend`
**Start the backend server**

- Validates `.env` configuration
- Shows server URL and mode
- Starts Express API on port 5000

**When to use:** When developing with real backend (not MOCK_MODE)

**Terminal output:**
```
🚀 Starting Opus Backend Server
✅ Environment configured
📊 Server will start on: http://localhost:5000
```

---

#### `npm run start:mobile`
**Start the mobile app with Expo**

- Checks mobile dependencies
- Detects MOCK_MODE status
- Shows helpful tips for iOS/Android
- Starts Expo dev server

**When to use:** Every time you want to run the mobile app

**Terminal output:**
```
📱 Starting Opus Mobile App
📝 MOCK_MODE is ENABLED
   Press i - iOS simulator
   Press a - Android emulator
```

---

### 🔧 Database Operations

#### `npm run db:push`
**Push schema changes to database**

- Applies Drizzle schema to your PostgreSQL database
- Creates/updates tables
- Non-destructive (preserves data)

**When to use:**
- After setup (first time)
- After changing `shared/schema.ts`

---

#### `npm run reset:db`
**⚠️ DANGER: Reset database (deletes all data)**

- Drops all tables
- Pushes fresh schema
- **PERMANENTLY DELETES ALL DATA**
- Requires double confirmation

**When to use:**
- Starting fresh in development
- After major schema changes
- **NEVER in production**

---

## Script Files

All scripts are located in `/scripts/` directory:

| Script | Description |
|--------|-------------|
| `setup.sh` | Initial project setup |
| `quick-start.sh` | Interactive setup wizard |
| `health-check.sh` | Environment verification |
| `start-backend.sh` | Launch backend server |
| `start-mobile.sh` | Launch mobile app |
| `reset-database.sh` | Database reset (destructive) |

## Typical Workflow

### For UI/UX Testing (No Backend Required)

```bash
# 1. One-time setup
npm run setup

# 2. Start mobile app (MOCK_MODE enabled by default)
npm run start:mobile

# Press 'i' for iOS or 'a' for Android
```

That's it! The app works fully in MOCK_MODE with realistic data.

---

### For Full-Stack Development (With Backend)

```bash
# 1. One-time setup
npm run setup

# 2. Edit .env with real database URL and API keys
nano .env

# 3. Initialize database
npm run db:push

# 4. Verify everything is configured
npm run health-check

# 5. Terminal 1: Start backend
npm run start:backend

# 6. Terminal 2: Start mobile
npm run start:mobile

# 7. Disable MOCK_MODE in mobile app
# Edit mobile/lib/api.ts and mobile/lib/auth-store.ts
# Set MOCK_MODE = false
```

---

## Troubleshooting

### "Command not found: bash"
**Solution:** You're on Windows. Use Git Bash or WSL, or run the `.sh` files directly:
```bash
sh scripts/setup.sh
```

### "Permission denied"
**Solution:** Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### "Database connection failed"
**Solution:**
1. Check `DATABASE_URL` in `.env`
2. Verify database is running
3. Test connection manually

### "AI features not working"
**Solution:**
1. Add at least one API key to `.env`:
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `OPENAI_API_KEY=sk-...`
2. Restart backend server

---

## Creating New Scripts

When adding new scripts:

1. Create in `/scripts/` directory
2. Make executable: `chmod +x scripts/your-script.sh`
3. Add to `package.json` scripts section
4. Document in this README

**Script template:**
```bash
#!/bin/bash
# Script Description

echo "🎯 Script Name"
echo "=============="

# Your code here
```

---

## Environment Variables Reference

Required in `.env`:

```env
# Database (required)
DATABASE_URL=postgresql://user:password@host:5432/database

# Session security (required)
SESSION_SECRET=your-random-secret-string

# AI providers (optional but recommended)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Server config (optional)
PORT=5000
NODE_ENV=development
```

---

## Support

If scripts don't work:
1. Run `npm run health-check` to diagnose issues
2. Check [CLAUDE.md](../CLAUDE.md) for detailed setup
3. Review error messages carefully
4. Ensure Node.js 20+ is installed

---

**Happy developing! 🎯**
