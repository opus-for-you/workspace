#!/bin/bash

# Reset Opus Database
# WARNING: This will delete all data and recreate the schema

echo "⚠️  OPUS DATABASE RESET"
echo "======================="
echo ""
echo "This will:"
echo "  1. Drop all tables in your database"
echo "  2. Push a fresh schema"
echo "  3. DELETE ALL DATA"
echo ""

read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Reset cancelled"
    exit 0
fi

echo ""
read -p "Really? This cannot be undone. Type 'RESET' to confirm: " confirm2

if [ "$confirm2" != "RESET" ]; then
    echo "❌ Reset cancelled"
    exit 0
fi

echo ""
echo "🔄 Resetting database..."

# Load environment to get DATABASE_URL
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    exit 1
fi

export $(grep -v '^#' .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env"
    exit 1
fi

echo "📋 Pushing fresh schema..."
npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database reset complete!"
    echo ""
    echo "The database now has a fresh schema with no data."
else
    echo "❌ Database reset failed"
    exit 1
fi
