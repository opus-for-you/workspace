#!/bin/bash

# Start Opus Backend Server
# Simple script to start the backend with helpful output

echo "🚀 Starting Opus Backend Server"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Run: npm run setup"
    exit 1
fi

# Load environment variables to check them
export $(grep -v '^#' .env | xargs)

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"user:password"* ]]; then
    echo "❌ DATABASE_URL not configured in .env"
    exit 1
fi

# Check SESSION_SECRET
if [ -z "$SESSION_SECRET" ] || [[ "$SESSION_SECRET" == *"change-this"* ]]; then
    echo "❌ SESSION_SECRET not configured in .env"
    exit 1
fi

echo "✅ Environment configured"
echo "📊 Server will start on: http://localhost:${PORT:-5000}"
echo "🔍 Mode: ${NODE_ENV:-development}"
echo ""

# Check for AI keys
if [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  WARNING: No AI API keys configured"
    echo "   AI features will not work without at least one key"
    echo ""
fi

echo "Press Ctrl+C to stop the server"
echo "--------------------------------"
echo ""

# Start the server
npm run dev
