# 🚀 Quick Start - Fresh Data

## 🎯 ONE COMMAND - Setup & Run Everything

```bash
npm run setup:run
```

This single command will:
1. ✅ Stop any running services
2. ✅ Install all dependencies (backend, web, mobile)
3. ✅ Seed database with fresh data
4. ✅ Start backend + web + mobile (ALL services)

### Alternative: Backend + Web Only
```bash
npm run setup:run:web
```

---

## Alternative: Start with Fresh Data (if already installed)

```bash
npm run stop && npm run seed && npm start
```

This command will:
1. ✅ Stop all running services
2. ✅ Seed database with fresh initial data
3. ✅ Start backend + web app

---

## Step-by-Step Commands

### 1. Stop All Services
```bash
npm run stop
```

### 2. Seed Database (Fresh Data)
```bash
npm run seed
```

### 3. Start Application
```bash
npm start
```

### 4. Start Mobile App (Optional, in new terminal)
```bash
npm run start:mobile
```

---

## What Gets Seeded

- ✅ **7 Users** (1 admin, 3 customers, 3 providers)
- ✅ **6 Categories** (Parcel, Food, Document, Grocery, Express, Furniture)
- ✅ **21 Services** (across all categories)
- ✅ **Sample Bookings** (for testing)

---

## Access Points

- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mobile App**: Scan QR code from `npm run start:mobile`

---

## Login Credentials

- **Admin**: admin@example.com / admin123
- **Customer**: kamal@example.com / customer123
- **Provider**: ravi@example.com / provider123

---

## All Available Commands

```bash
# Start services
npm start              # Start backend + web
npm run start:backend  # Backend only
npm run start:web      # Web app only
npm run start:mobile   # Mobile app only

# Database
npm run seed           # Seed database with fresh data

# Control
npm run stop           # Stop all services
npm run restart        # Restart all services

# Setup
npm run setup          # Install all + seed
npm run install:all    # Install all dependencies
```

---

## Note

The backend **automatically seeds** the database on startup if it's empty. So you can also just run:

```bash
npm start
```

And it will auto-seed if needed!
