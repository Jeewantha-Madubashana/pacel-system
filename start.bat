@echo off
REM Parcel Delivery System - Startup Script for Windows
REM This script starts all services (backend and web)

echo.
echo 🚀 Starting Parcel Delivery System...
echo.

REM Check if .env exists in backend
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your MySQL credentials before continuing.
    echo.
)

echo 📦 Starting Backend Server...
cd backend
call npm install >nul 2>&1
echo ✓ Backend dependencies installed

REM Setup .env if it doesn't exist
if not exist ".env" (
    echo ⚙️  Setting up .env file...
    call npm run setup >nul 2>&1
    echo ✓ .env file configured
)

REM Check if database needs seeding
set /p SEED_DB="Do you want to seed the database with Sri Lankan sample data? (y/n): "
if /i "%SEED_DB%"=="y" (
    echo 🌱 Seeding database...
    call npm run seed
)

echo 🚀 Starting backend server on port 5000...
start "Backend Server" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak >nul

echo 🌐 Starting Web Frontend...
cd web
call npm install >nul 2>&1
echo ✓ Web dependencies installed
echo 🚀 Starting web app on port 3000...
start "Web App" cmd /k "npm run dev"
cd ..

echo.
echo ✅ All services started!
echo.
echo 📍 Services:
echo   Backend API:  http://localhost:5000
echo   Web App:      http://localhost:3000
echo.
echo 👤 Default Login:
echo   Admin:    admin@example.com / admin123
echo   Customer: kamal@example.com / customer123
echo   Provider: ravi@example.com / provider123
echo.
echo Press any key to exit...
pause >nul

