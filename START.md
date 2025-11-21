# 🚀 Quick Start Commands

## Root Level NPM Commands

All commands can be run from the root directory:

### Start All Services
```bash
npm start
# or
npm run start:all
```
Starts both backend and web app simultaneously.

### Start Individual Services
```bash
# Backend only
npm run start:backend

# Web app only
npm run start:web

# Mobile app only
npm run start:mobile
```

### Database Operations
```bash
# Seed database with initial data
npm run seed

# Setup everything (install + seed)
npm run setup
```

### Installation
```bash
# Install all dependencies
npm run install:all

# Install individual services
npm run install:backend
npm run install:web
npm run install:mobile
```

### Utility Commands
```bash
# Restart all services
npm run restart

# Stop all services
npm run stop
```

---

## 📋 Complete Setup & Start

### First Time Setup:
```bash
# 1. Install all dependencies
npm run install:all

# 2. Seed database with initial data
npm run seed

# 3. Start all services
npm start
```

### Daily Usage:
```bash
# Just start everything
npm start
```

The backend will automatically seed the database if it's empty!

---

## 🌐 Access Points

- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mobile App**: Run `npm run start:mobile` and scan QR code

---

## 👤 Login Credentials

- **Admin**: admin@example.com / admin123
- **Customer**: kamal@example.com / customer123
- **Provider**: ravi@example.com / provider123

---

## 📱 Mobile App

The mobile app will automatically detect your IP address when you run:
```bash
npm run start:mobile
```

Or use the startup script:
```bash
./mobile/start-mobile.sh
```

