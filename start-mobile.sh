#!/bin/bash

# Mobile App Startup Script

echo "📱 Starting Mobile App..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd mobile

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing mobile app dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Check if backend is running
if ! lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Backend server is not running on port 5000${NC}"
    echo -e "${YELLOW}Please start the backend server first!${NC}"
    echo ""
    read -p "Do you want to start the backend now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd ../backend
        npm run dev &
        BACKEND_PID=$!
        cd ../mobile
        sleep 3
    else
        echo "Please start the backend server manually and try again."
        exit 1
    fi
fi

echo -e "${BLUE}🚀 Starting Expo development server...${NC}"
echo ""
echo -e "${GREEN}📱 Mobile app will start shortly...${NC}"
echo -e "${YELLOW}Note: For Android, update API URL in src/utils/api.js to use your computer's IP address${NC}"
echo ""

npm start

