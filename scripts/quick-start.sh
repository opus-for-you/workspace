#!/bin/bash

# Opus Quick Start
# One-command setup and launch for new developers

echo "🎯 Opus Quick Start"
echo "==================="
echo ""
echo "This script will:"
echo "  1. Install all dependencies"
echo "  2. Create .env template (if needed)"
echo "  3. Run health check"
echo "  4. Guide you through next steps"
echo ""

read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelled"
    exit 0
fi

# Run setup
echo ""
echo "Running setup..."
bash scripts/setup.sh

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Setup failed. Please fix errors and try again."
    exit 1
fi

# Run health check
echo ""
echo "Running health check..."
bash scripts/health-check.sh

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Health check found issues."
    echo "Please fix them before continuing."
    echo ""
    echo "Common fixes:"
    echo "  1. Edit .env with your database URL and secrets"
    echo "  2. Run: npm run db:push"
    echo "  3. Run: npm run health-check"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Ready to start developing!"
echo ""
echo "Choose an option:"
echo "  1. Start in MOCK MODE (no backend needed, perfect for testing UI)"
echo "  2. Start with REAL BACKEND (requires database and API keys)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "📱 Starting mobile app in MOCK MODE..."
    echo ""
    echo "The app is already configured for MOCK MODE by default."
    echo "Opening mobile app now..."
    echo ""
    sleep 2
    npm run start:mobile
elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔧 To use real backend:"
    echo "  1. Make sure .env is configured with real database"
    echo "  2. Run in terminal 1: npm run start:backend"
    echo "  3. Set MOCK_MODE = false in mobile/lib/api.ts"
    echo "  4. Set MOCK_MODE = false in mobile/lib/auth-store.ts"
    echo "  5. Run in terminal 2: npm run start:mobile"
    echo ""
    echo "Start backend now? (y/n)"
    read -p "> " start_backend
    if [ "$start_backend" = "y" ]; then
        npm run start:backend
    fi
else
    echo "Invalid choice. Run 'npm run start:mobile' when ready."
fi
