import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';

// Import models
import User from './models/User.js';
import Provider from './models/Provider.js';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import File from './models/File.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import locationRoutes from './routes/location.js';
import providerRoutes from './routes/providers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/providers', providerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Define associations (avoid circular dependencies)
User.hasOne(Provider, { foreignKey: 'user_id', as: 'provider' });
Booking.hasMany(File, { foreignKey: 'booking_id', as: 'Files' });

// Sync database and start server
const syncDatabase = async () => {
  try {
    // Create database if it doesn't exist
    const createDatabaseIfNotExists = (await import('./utils/initDatabase.js')).default;
    await createDatabaseIfNotExists();

    // Now connect to the database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminExists) {
      const bcrypt = (await import('bcrypt')).default;
      const password_hash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password_hash,
        role: 'admin',
      });
      console.log('Default admin user created (admin@example.com / admin123)');
    }

    // Auto-seed database with initial data if empty
    const autoSeedDatabase = (await import('./utils/autoSeed.js')).default;
    await autoSeedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

syncDatabase();

export default app;

