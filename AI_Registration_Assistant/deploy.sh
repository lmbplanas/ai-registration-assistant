#!/bin/bash
set -e

# Deployment script for AI Registration Assistant
# This script helps deploy both frontend and backend services

echo "🚀 Starting deployment process..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if user is logged in to Vercel
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Deploy Backend to Render
echo "\n🌐 Deploying backend to Render..."

# Check if render-cli is installed
if ! command -v render &> /dev/null; then
    echo "Installing Render CLI..."
    curl -s https://render.com/downloads/render-cli/install-render.sh | bash
    export PATH="$HOME/.render/cli:$PATH"
fi

# Deploy to Render
cd backend
render blueprints save --file ../render.yaml --name ai-registration-backend --profile default
render blueprints deploy --name ai-registration-backend
cd ..

# Get the backend URL
BACKEND_URL="https://ai-registration-backend.onrender.com"
echo "✅ Backend deployed to: $BACKEND_URL"

# Deploy Frontend to Vercel
echo "\n🖥️  Deploying frontend to Vercel..."
cd frontend

# Set the API URL in Vercel environment
vercel env add VITE_API_URL production <<< "$BACKEND_URL/api"

# Deploy to Vercel
vercel --prod

# Get the frontend URL
FRONTEND_URL=$(vercel ls | grep frontend | head -n 1 | awk '{print $2}')
echo "✅ Frontend deployed to: $FRONTEND_URL"

echo "\n🎉 Deployment complete!"
echo "🔗 Frontend: $FRONTEND_URL"
echo "🔗 Backend API: $BACKEND_URL"
echo "\nNext steps:"
echo "1. Update CORS_ORIGINS in Render dashboard to allow requests from $FRONTEND_URL"
echo "2. Test the application at $FRONTEND_URL"

exit 0
