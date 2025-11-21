#!/bin/bash

# Script to open both web and mobile apps
# This opens them in separate terminal windows

echo "🚀 Opening Web App and Mobile App..."
echo ""

# Get the project directory
PROJECT_DIR="/Users/jkarunarathna/Desktop/Post App"

# Check if backend is running
if ! lsof -ti:5000 > /dev/null; then
    echo "⚠️  Backend is not running. Starting backend..."
    cd "$PROJECT_DIR/backend"
    osascript -e "tell app \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && npm run dev\""
    sleep 3
fi

# Open Web App in new terminal
echo "🌐 Opening Web App..."
osascript -e "tell app \"Terminal\" to do script \"cd '$PROJECT_DIR/web' && npm run dev\""

# Open Mobile App in new terminal  
echo "📱 Opening Mobile App..."
osascript -e "tell app \"Terminal\" to do script \"cd '$PROJECT_DIR/mobile' && npm install && npx expo start\""

echo ""
echo "✅ Apps are opening in separate terminal windows!"
echo ""
echo "📋 Next Steps:"
echo "  1. Web App: Open http://localhost:3000 in your browser"
echo "  2. Mobile App: Scan the QR code with Expo Go app"
echo ""
echo "⚠️  Note: If web app shows Node.js error, update Node.js:"
echo "     nvm install 20 && nvm use 20"

