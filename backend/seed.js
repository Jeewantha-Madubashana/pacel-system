import sequelize from './config/database.js';
import User from './models/User.js';
import Provider from './models/Provider.js';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import bcrypt from 'bcrypt';
import createDatabaseIfNotExists from './utils/initDatabase.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Create database if it doesn't exist
    await createDatabaseIfNotExists();

    // Ensure database is connected
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models to ensure tables exist
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Set up associations
    User.hasOne(Provider, { foreignKey: 'user_id', as: 'provider' });

    // Clear existing data
    await Booking.destroy({ where: {}, force: true });
    await Service.destroy({ where: {}, force: true });
    await Category.destroy({ where: {}, force: true });
    await Provider.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    console.log('Cleared existing data...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: adminPassword,
      role: 'admin',
    });
    console.log('Created admin user');

    // Create Customer Users
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customers = await User.bulkCreate([
      {
        name: 'Kamal Perera',
        email: 'kamal@example.com',
        password_hash: customerPassword,
        role: 'customer',
      },
      {
        name: 'Nimal Silva',
        email: 'nimal@example.com',
        password_hash: customerPassword,
        role: 'customer',
      },
      {
        name: 'Sunil Fernando',
        email: 'sunil@example.com',
        password_hash: customerPassword,
        role: 'customer',
      },
    ]);
    console.log('Created customer users');

    // Create Provider Users
    const providerPassword = await bcrypt.hash('provider123', 10);
    const providers = await User.bulkCreate([
      {
        name: 'Ravi Wijesinghe',
        email: 'ravi@example.com',
        password_hash: providerPassword,
        role: 'provider',
      },
      {
        name: 'Dilshan Karunaratne',
        email: 'dilshan@example.com',
        password_hash: providerPassword,
        role: 'provider',
      },
      {
        name: 'Chaminda Bandara',
        email: 'chaminda@example.com',
        password_hash: providerPassword,
        role: 'provider',
      },
    ]);
    console.log('Created provider users');

    // Create Provider records
    await Provider.bulkCreate([
      {
        user_id: providers[0].id,
        skills: 'Parcel delivery, Food delivery, Document delivery',
        availability: true,
      },
      {
        user_id: providers[1].id,
        skills: 'Express delivery, Heavy items, Furniture delivery',
        availability: true,
      },
      {
        user_id: providers[2].id,
        skills: 'Same-day delivery, Medical supplies, Grocery delivery',
        availability: true,
      },
    ]);
    console.log('Created provider records');

    // Create Categories
    const categories = await Category.bulkCreate([
      { name: 'Parcel Delivery' },
      { name: 'Food Delivery' },
      { name: 'Document Delivery' },
      { name: 'Grocery Delivery' },
      { name: 'Express Delivery' },
      { name: 'Furniture & Heavy Items' },
    ]);
    console.log('Created categories');

    // Create Services with Sri Lankan pricing (LKR converted to USD for simplicity)
    const services = await Service.bulkCreate([
      // Parcel Delivery
      {
        category_id: categories[0].id,
        name: 'Standard Parcel Delivery (Colombo)',
        price: 5.00,
      },
      {
        category_id: categories[0].id,
        name: 'Standard Parcel Delivery (Other Cities)',
        price: 8.00,
      },
      {
        category_id: categories[0].id,
        name: 'Parcel Delivery (Up to 5kg)',
        price: 10.00,
      },
      {
        category_id: categories[0].id,
        name: 'Parcel Delivery (5-10kg)',
        price: 15.00,
      },
      {
        category_id: categories[0].id,
        name: 'Parcel Delivery (10-20kg)',
        price: 25.00,
      },
      
      // Food Delivery
      {
        category_id: categories[1].id,
        name: 'Food Delivery (Colombo)',
        price: 3.00,
      },
      {
        category_id: categories[1].id,
        name: 'Food Delivery (Suburbs)',
        price: 5.00,
      },
      {
        category_id: categories[1].id,
        name: 'Food Delivery (Express - 30 min)',
        price: 8.00,
      },
      
      // Document Delivery
      {
        category_id: categories[2].id,
        name: 'Document Delivery (Same Day)',
        price: 6.00,
      },
      {
        category_id: categories[2].id,
        name: 'Document Delivery (Express)',
        price: 10.00,
      },
      {
        category_id: categories[2].id,
        name: 'Legal Document Delivery',
        price: 15.00,
      },
      
      // Grocery Delivery
      {
        category_id: categories[3].id,
        name: 'Grocery Delivery (Small - Up to 10kg)',
        price: 4.00,
      },
      {
        category_id: categories[3].id,
        name: 'Grocery Delivery (Medium - 10-20kg)',
        price: 7.00,
      },
      {
        category_id: categories[3].id,
        name: 'Grocery Delivery (Large - 20kg+)',
        price: 12.00,
      },
      
      // Express Delivery
      {
        category_id: categories[4].id,
        name: 'Express Delivery (2 hours)',
        price: 20.00,
      },
      {
        category_id: categories[4].id,
        name: 'Express Delivery (1 hour)',
        price: 30.00,
      },
      {
        category_id: categories[4].id,
        name: 'Express Delivery (30 minutes)',
        price: 50.00,
      },
      
      // Furniture & Heavy Items
      {
        category_id: categories[5].id,
        name: 'Furniture Delivery (Small)',
        price: 25.00,
      },
      {
        category_id: categories[5].id,
        name: 'Furniture Delivery (Medium)',
        price: 40.00,
      },
      {
        category_id: categories[5].id,
        name: 'Furniture Delivery (Large)',
        price: 60.00,
      },
      {
        category_id: categories[5].id,
        name: 'Heavy Items Delivery (20-50kg)',
        price: 35.00,
      },
    ]);
    console.log('Created services');

    // Create Sample Bookings with Sri Lankan locations
    const bookings = await Booking.bulkCreate([
      {
        customer_id: customers[0].id,
        provider_id: providers[0].id,
        service_id: services[0].id,
        pickup_lat: 6.9271,
        pickup_lng: 79.8612,
        pickup_address: 'Galle Face, Colombo 03, Sri Lanka',
        drop_lat: 6.9049,
        drop_lng: 79.8540,
        drop_address: 'Bambalapitiya, Colombo 04, Sri Lanka',
        status: 'completed',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        customer_id: customers[1].id,
        provider_id: providers[1].id,
        service_id: services[5].id,
        pickup_lat: 6.9147,
        pickup_lng: 79.9730,
        pickup_address: 'Kotte, Sri Jayawardenepura Kotte, Sri Lanka',
        drop_lat: 6.9271,
        drop_lng: 79.8612,
        drop_address: 'Galle Face, Colombo 03, Sri Lanka',
        status: 'on_the_way',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer_id: customers[2].id,
        service_id: services[2].id,
        pickup_lat: 6.8356,
        pickup_lng: 79.9206,
        pickup_address: 'Negombo, Sri Lanka',
        drop_lat: 6.9271,
        drop_lng: 79.8612,
        drop_address: 'Colombo Fort, Colombo 01, Sri Lanka',
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customer_id: customers[0].id,
        provider_id: providers[2].id,
        service_id: services[8].id,
        pickup_lat: 6.9271,
        pickup_lng: 79.8612,
        pickup_address: 'Colombo Fort, Colombo 01, Sri Lanka',
        drop_lat: 7.2906,
        drop_lng: 80.6337,
        drop_address: 'Kandy, Central Province, Sri Lanka',
        status: 'started',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customer_id: customers[1].id,
        service_id: services[12].id,
        pickup_lat: 6.0329,
        pickup_lng: 80.2170,
        pickup_address: 'Galle, Southern Province, Sri Lanka',
        drop_lat: 6.9147,
        drop_lng: 79.9730,
        drop_address: 'Kotte, Sri Jayawardenepura Kotte, Sri Lanka',
        status: 'pending',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ]);
    console.log('Created sample bookings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🇱🇰 Sri Lankan sample data has been added!');
    console.log('\nLogin credentials:');
    console.log('Admin:    admin@example.com / admin123');
    console.log('Customer: kamal@example.com / customer123');
    console.log('Provider: ravi@example.com / provider123');
    console.log('\nOther test users:');
    console.log('Customer: nimal@example.com / customer123');
    console.log('Customer: sunil@example.com / customer123');
    console.log('Provider: dilshan@example.com / provider123');
    console.log('Provider: chaminda@example.com / provider123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await sequelize.close();
    process.exit(1);
  }
};

// Run seed
seedDatabase();

