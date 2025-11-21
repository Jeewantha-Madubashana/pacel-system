# Parcel/Service Delivery System

A complete full-stack application for booking services or parcel delivery with web and mobile apps sharing the same backend.

## Project Structure

```
Post App/
├── backend/          # Node.js + Express + MySQL backend
├── web/              # React web frontend (Admin + Customer)
└── mobile/           # React Native mobile app (Customer + Provider)
```

## Features

### Backend
- RESTful API with Express.js
- MySQL database with Sequelize ORM
- JWT authentication
- Password hashing with bcrypt
- File upload with Multer
- Location search using Nominatim (OpenStreetMap)

### Web App (React + Vite)
- **Admin Dashboard**: Manage users, categories, services, view all bookings
- **Customer Dashboard**: Browse services, create bookings with map picker, track bookings
- **Provider Dashboard**: View and accept pending jobs, update job status

### Mobile App (React Native + Expo)
- **Customer App**: Browse services, create bookings, track status
- **Provider App**: View pending jobs, accept jobs, update status, navigate to locations

## Quick Start

### 🚀 Fastest Way (All-in-One)

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

This will install dependencies, optionally seed the database with Sri Lankan sample data, and start all services.

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials (or use defaults):
```
DB_HOST=localhost
DB_PORT=3000
DB_USER=root
DB_PASSWORD=ptutrandecesten
DB_NAME=parcel_delivery
JWT_SECRET=your-secret-key-change-this
```

**Note:** The database will be created automatically if it doesn't exist. No need to create it manually!

5. (Optional) Seed database with Sri Lankan sample data:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

The server will automatically create tables and a default admin user:
- Email: `admin@example.com`
- Password: `admin123`

**After seeding, you'll also have:**
- Customer: `kamal@example.com` / `customer123`
- Provider: `ravi@example.com` / `provider123`

### Web App Setup

1. Navigate to web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/utils/api.js` if needed (use your computer's IP for Android)

4. Start Expo:
```bash
npm start
```

5. Scan QR code with Expo Go app or use simulator

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/category/:categoryId` - Get services by category
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Bookings
- `GET /api/bookings` - Get bookings (filtered by role)
- `GET /api/bookings/pending` - Get pending bookings (Provider)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking (Customer)
- `PATCH /api/bookings/:id/accept` - Accept booking (Provider)
- `PATCH /api/bookings/:id/reject` - Reject booking (Provider)
- `PATCH /api/bookings/:id/status` - Update status (Provider)
- `POST /api/bookings/:id/files` - Upload file (Provider)

### Location
- `GET /api/location/search?q=query` - Search location
- `GET /api/location/reverse?lat=...&lng=...` - Reverse geocode

### Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/:id` - Get provider by ID
- `PUT /api/providers/:id` - Update provider

## Technology Stack

- **Backend**: Node.js, Express, MySQL, Sequelize, JWT, bcrypt, Multer
- **Web Frontend**: React, Vite, TailwindCSS, Material-UI, Leaflet
- **Mobile App**: React Native, Expo, React Native Maps, React Native Paper

## Default Login Credentials

**After initial setup:**
- **Admin**: admin@example.com / admin123

**After running seed script (`npm run seed` in backend):**
- **Admin**: admin@example.com / admin123
- **Customer**: kamal@example.com / customer123
- **Provider**: ravi@example.com / provider123

You can also register new users through the registration page.

## 🇱🇰 Sri Lankan Sample Data

The seed script (`npm run seed` in backend) includes:
- **Locations**: Colombo, Kandy, Galle, Negombo, Kotte with real coordinates
- **Services**: Parcel delivery, Food delivery, Document delivery, Grocery delivery, Express delivery, Furniture delivery
- **Sample Bookings**: With real Sri Lankan addresses
- **Users**: 3 customers and 3 providers with Sri Lankan names

## Notes

- Make sure MySQL is running before starting the backend
- For mobile app on Android, use your computer's local IP instead of `localhost` in the API URL
- The backend serves uploaded files from `/uploads` directory
- Location services require appropriate permissions on mobile devices
- Use the startup scripts (`start.sh` or `start.bat`) for easiest setup

