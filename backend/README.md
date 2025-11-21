# Parcel Delivery Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is already configured with your MySQL settings:
```
DB_HOST=localhost
DB_PORT=3000
DB_USER=root
DB_PASSWORD=ptutrandecesten
DB_NAME=parcel_delivery
```

**Note:** The database will be created automatically if it doesn't exist. No manual database creation needed!

3. Start the server:
```bash
npm run dev
```

The server will automatically:
- Create the database if it doesn't exist
- Create all database tables
- Create a default admin user (admin@example.com / admin123)

4. (Optional) Seed database with Sri Lankan sample data:
```bash
npm run seed
```

## API Endpoints

### Auth
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
