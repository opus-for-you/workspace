#!/bin/bash

# Opus Help - Show all available commands

cat << 'EOF'

🎯 Opus Development Commands
============================

Quick Start
-----------
  npm run quick-start       Interactive setup wizard (recommended for first time)
  npm run setup             Install dependencies and create .env
  npm run health-check      Verify environment configuration

Running the App
---------------
  npm run start:backend     Start backend server (port 5000)
  npm run start:mobile      Start mobile app with Expo

Database
--------
  npm run db:push           Push schema changes to database
  npm run reset:db          ⚠️  Reset database (deletes all data)

Development
-----------
  npm run dev               Start backend (direct, no validation)
  npm run build             Build for production
  npm run check             TypeScript type checking

Mobile (Direct Expo)
--------------------
  cd mobile && npm start    Start Expo dev server
  cd mobile && npm run ios  iOS simulator
  cd mobile && npm run android  Android emulator

Help & Documentation
--------------------
  npm run help              Show this help message
  cat GETTING_STARTED.md    Quick start guide
  cat CLAUDE.md             Complete developer guide
  cat scripts/README.md     Script documentation

Tips
----
  • New to the project? Run: npm run quick-start
  • Something not working? Run: npm run health-check
  • Want to see the app quickly? Run: npm run start:mobile
  • Need AI features? Add API keys to .env

Documentation
-------------
  GETTING_STARTED.md        For new developers
  CLAUDE.md                 Complete implementation guide
  scripts/README.md         Helper scripts explained
  docs/                     Full technical documentation

Environment
-----------
  .env file required for backend (created by npm run setup)
  MOCK_MODE enabled by default in mobile app (no backend needed)

EOF
