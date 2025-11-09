#!/bin/bash

# Opus Health Check Script
# Verifies that the development environment is properly configured

echo "🏥 Opus Health Check"
echo "===================="
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 20 ]; then
        echo "   ✅ Node.js $(node -v) installed"
    else
        echo "   ❌ Node.js version 20+ required (you have $(node -v))"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ❌ Node.js not installed"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    echo "   ✅ npm $(npm -v) installed"
else
    echo "   ❌ npm not installed"
    ERRORS=$((ERRORS + 1))
fi

# Check root dependencies
echo "3. Checking backend dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend dependencies not installed (run: npm install --legacy-peer-deps)"
    ERRORS=$((ERRORS + 1))
fi

# Check mobile dependencies
echo "4. Checking mobile dependencies..."
if [ -d "mobile/node_modules" ]; then
    echo "   ✅ Mobile dependencies installed"
else
    echo "   ⚠️  Mobile dependencies not installed (run: cd mobile && npm install --legacy-peer-deps)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check .env file
echo "5. Checking .env file..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"

    # Check DATABASE_URL
    if grep -q "^DATABASE_URL=" .env && ! grep -q "user:password@host" .env; then
        echo "   ✅ DATABASE_URL configured"
    else
        echo "   ❌ DATABASE_URL not configured or has placeholder value"
        ERRORS=$((ERRORS + 1))
    fi

    # Check SESSION_SECRET
    if grep -q "^SESSION_SECRET=" .env && ! grep -q "change-this" .env; then
        echo "   ✅ SESSION_SECRET configured"
    else
        echo "   ❌ SESSION_SECRET not configured or has placeholder value"
        ERRORS=$((ERRORS + 1))
    fi

    # Check AI keys (optional)
    if grep -q "^ANTHROPIC_API_KEY=sk-" .env || grep -q "^OPENAI_API_KEY=sk-" .env; then
        echo "   ✅ At least one AI API key configured"
    else
        echo "   ⚠️  No AI API keys configured (AI features won't work)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ❌ .env file not found (run: npm run setup)"
    ERRORS=$((ERRORS + 1))
fi

# Check database schema
echo "6. Checking database schema..."
if [ -d "drizzle" ]; then
    echo "   ℹ️  Schema migrations exist"
else
    echo "   ⚠️  No schema migrations (you may need to run: npm run db:push)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check TypeScript
echo "7. Checking TypeScript..."
npx tsc --noEmit &> /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ TypeScript checks passed"
else
    echo "   ⚠️  TypeScript errors detected (run: npm run check)"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 All checks passed! You're ready to go!"
    echo ""
    echo "Start developing:"
    echo "  npm run start:backend   # Start backend server"
    echo "  npm run start:mobile    # Start mobile app"
elif [ $ERRORS -eq 0 ]; then
    echo "✅ No critical errors ($WARNINGS warnings)"
    echo ""
    echo "You can start developing, but consider fixing warnings."
else
    echo "❌ Found $ERRORS error(s) and $WARNINGS warning(s)"
    echo ""
    echo "Please fix the errors above before continuing."
    exit 1
fi
