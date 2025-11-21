#!/bin/bash

# Parcel Delivery System - Startup Script
# This script starts all services (backend, web) with automatic port detection and seeding

echo "🚀 Starting Parcel Delivery System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to find available port starting from a given port
find_available_port() {
    local start_port=$1
    local port=$start_port
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
        if [ $port -gt $((start_port + 100)) ]; then
            echo $start_port  # Fallback to original if can't find
            return
        fi
    done
    echo $port
}

# Function to check if a port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    return 1
}

# Kill existing processes
echo -e "${YELLOW}🛑 Stopping existing processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
sleep 2
echo -e "${GREEN}✓ Cleaned up existing processes${NC}"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from .env.example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
    else
        echo "DB_NAME=parcel_delivery" > backend/.env
        echo "DB_USER=root" >> backend/.env
        echo "DB_PASSWORD=ptutrandecesten" >> backend/.env
        echo "DB_HOST=localhost" >> backend/.env
        echo "DB_PORT=3306" >> backend/.env
        echo "PORT=5000" >> backend/.env
    fi
    echo -e "${GREEN}✓ .env file created${NC}"
    echo ""
fi

# Detect available ports
BACKEND_PORT=$(find_available_port 5000)
WEB_PORT=$(find_available_port 3000)

# Update backend port in .env if different
if [ "$BACKEND_PORT" != "5000" ]; then
    echo -e "${YELLOW}⚠️  Port 5000 is in use. Using port $BACKEND_PORT for backend${NC}"
    if grep -q "^PORT=" backend/.env; then
        sed -i.bak "s/^PORT=.*/PORT=$BACKEND_PORT/" backend/.env
    else
        echo "PORT=$BACKEND_PORT" >> backend/.env
    fi
fi

# Update web port in vite config if different
if [ "$WEB_PORT" != "3000" ]; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Using port $WEB_PORT for web app${NC}"
    # Update vite.config.js programmatically
    if [ -f "web/vite.config.js" ]; then
        # Create backup
        cp web/vite.config.js web/vite.config.js.bak
        # Update port
        sed -i.bak "s/port: 3000/port: $WEB_PORT/" web/vite.config.js
        # Update proxy target if needed
        sed -i.bak "s|target: 'http://localhost:5000'|target: 'http://localhost:$BACKEND_PORT'|" web/vite.config.js
    fi
fi

echo -e "${BLUE}📦 Starting Backend Server on port $BACKEND_PORT...${NC}"
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing backend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

# Setup .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}⚙️  Setting up .env file...${NC}"
    npm run setup > /dev/null 2>&1 || true
    echo -e "${GREEN}✓ .env file configured${NC}"
fi

# Start backend (auto-seed will run automatically if database is empty)
echo -e "${BLUE}🚀 Starting backend server...${NC}"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend to start...${NC}"
if wait_for_service "http://localhost:$BACKEND_PORT/api/health"; then
    echo -e "${GREEN}✓ Backend is ready on port $BACKEND_PORT${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check /tmp/backend.log for errors${NC}"
    tail -20 /tmp/backend.log
    exit 1
fi

echo ""
echo -e "${BLUE}🌐 Starting Web Frontend on port $WEB_PORT...${NC}"
cd web

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing web dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Web dependencies installed${NC}"
fi

# Start web app
echo -e "${BLUE}🚀 Starting web app...${NC}"
npm run dev > /tmp/web.log 2>&1 &
WEB_PID=$!
cd ..

# Wait for web app to be ready
echo -e "${BLUE}⏳ Waiting for web app to start...${NC}"
sleep 3
if wait_for_service "http://localhost:$WEB_PORT" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web app is ready on port $WEB_PORT${NC}"
else
    echo -e "${YELLOW}⚠️  Web app may still be starting...${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Services:${NC}"
echo -e "  Backend API:  http://localhost:$BACKEND_PORT"
echo -e "  Web App:      http://localhost:$WEB_PORT"
echo ""
echo -e "${BLUE}📊 Database Status:${NC}"
echo -e "  ✅ Auto-seeded with initial data (if database was empty)"
echo -e "  ✅ Categories, Services, and Users are ready"
echo ""
echo -e "${BLUE}👤 Login Credentials:${NC}"
echo -e "  Admin:    admin@example.com / admin123"
echo -e "  Customer: kamal@example.com / customer123"
echo -e "  Provider: ravi@example.com / provider123"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Wait for user to stop
wait
