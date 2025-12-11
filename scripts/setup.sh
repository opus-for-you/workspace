#!/bin/bash

# Opus Setup Script
# This script helps you set up the Opus development environment

set -e

echo "🎯 Opus Development Setup"
echo "========================="
echo ""

# Check for Node.js
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20 or higher is required. You have $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install root dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install --legacy-peer-deps

# Install mobile dependencies
echo ""
echo "📱 Installing mobile dependencies..."
cd mobile
npm install --legacy-peer-deps
cd ..

# Create .env file if it doesn't exist
echo ""
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database

# Session Secret (generate a random string)
SESSION_SECRET=change-this-to-a-random-secret-string

# AI API Keys (optional but recommended)
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=

# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development
EOF
    echo "✅ Created .env file"
    echo "⚠️  IMPORTANT: Edit .env and add your database URL and API keys"
else
    echo "ℹ️  .env file already exists, skipping creation"
fi

# Check if .env has placeholder values
echo ""
echo "🔍 Checking .env configuration..."
if grep -q "postgresql://user:password@host" .env; then
    echo "⚠️  WARNING: .env still has placeholder values"
    echo "   Please edit .env and update:"
    echo "   - DATABASE_URL (required)"
    echo "   - SESSION_SECRET (required)"
    echo "   - ANTHROPIC_API_KEY (recommended)"
    echo "   - OPENAI_API_KEY (recommended)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env with your actual credentials"
echo "   2. Run: npm run health-check"
echo "   3. Run: npm run db:push (to initialize database)"
echo "   4. Run: npm run start:backend (to start server)"
echo "   5. In another terminal: npm run start:mobile (to start mobile app)"
echo ""
echo "💡 Tip: Run 'npm run health-check' to verify your setup"
