#!/bin/bash

# Start Opus Mobile App
# Simple script to start the mobile app with Expo

echo "📱 Starting Opus Mobile App"
echo "==========================="
echo ""

# Check if mobile dependencies are installed
if [ ! -d "mobile/node_modules" ]; then
    echo "❌ Mobile dependencies not installed!"
    echo "   Run: cd mobile && npm install --legacy-peer-deps"
    exit 1
fi

cd mobile

# Check MOCK_MODE status
echo "🔍 Checking app configuration..."
if grep -q "MOCK_MODE = true" lib/api.ts 2>/dev/null; then
    echo "📝 MOCK_MODE is ENABLED"
    echo "   App will work without backend connection"
    echo "   Mock data will be used for all features"
    echo ""
    echo "   To use real backend:"
    echo "   1. Set MOCK_MODE = false in mobile/lib/api.ts"
    echo "   2. Set MOCK_MODE = false in mobile/lib/auth-store.ts"
    echo "   3. Update API_BASE_URL in mobile/lib/api.ts"
    echo "   4. Start backend: npm run start:backend"
elif grep -q "MOCK_MODE = false" lib/api.ts 2>/dev/null; then
    echo "🌐 MOCK_MODE is DISABLED"
    echo "   App will connect to backend API"
    echo "   Make sure backend is running: npm run start:backend"
else
    echo "ℹ️  Could not detect MOCK_MODE setting"
fi

echo ""
echo "Starting Expo..."
echo "Press Ctrl+C to stop"
echo "--------------------"
echo ""
echo "📱 When Expo starts, press:"
echo "   i - Open iOS simulator"
echo "   a - Open Android emulator"
echo "   w - Open in web browser"
echo ""

npm start
