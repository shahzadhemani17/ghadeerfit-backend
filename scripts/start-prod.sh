#!/bin/sh
set -e

echo "🚀 Starting production server..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client (in case it's needed)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Start the application
echo "✅ Starting Node.js application..."
exec node dist/index.js

