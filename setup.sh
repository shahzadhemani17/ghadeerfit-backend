#!/bin/bash

echo "🚀 Backend API Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL."
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/videostream?schema=public"
PORT=5000
NODE_ENV=development
SESSION_SECRET="your-secret-key-here-change-in-production"
EOF
    echo "⚙️  Please edit .env with your PostgreSQL credentials"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your PostgreSQL database URL"
echo "2. Run 'npm run prisma:generate' to generate Prisma client"
echo "3. Run 'npm run prisma:migrate' to set up the database"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "🌐 The backend API will be available at:"
echo "   http://localhost:5000"
echo ""

