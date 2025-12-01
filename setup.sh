#!/bin/bash

# ScribeFlow Setup Script
# This script helps you configure the application for development or production

set -e

echo "🚀 ScribeFlow Setup Script"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env from template..."
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
    echo "⚠️  IMPORTANT: Edit server/.env and add your GEMINI_API_KEY"
else
    echo "✅ server/.env already exists"
fi

# Check if frontend .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✅ Created .env"
fi

# Check if Gemini API key is configured
if ! grep -q "GEMINI_API_KEY=" server/.env || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" server/.env; then
    echo ""
    echo "⚠️  IMPORTANT: Configure your Gemini API Key"
    echo "   1. Go to https://aistudio.google.com"
    echo "   2. Create a new API key"
    echo "   3. Edit server/.env and set GEMINI_API_KEY=your_key_here"
    echo ""
fi

# Install dependencies
read -p "Do you want to install dependencies? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
    
    echo "📦 Installing backend dependencies..."
    cd server
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure GEMINI_API_KEY in server/.env"
echo "2. Run 'npm run dev:full' for development"
echo "3. Visit http://localhost:5173"
echo ""
echo "For Docker deployment:"
echo "  docker-compose up --build"
echo ""
echo "📚 Documentation:"
echo "  - Backend setup: BACKEND_SETUP.md"
echo "  - Production deployment: PRODUCTION_DEPLOYMENT.md"
