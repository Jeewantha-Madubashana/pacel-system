import sequelize from '../config/database.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import bcrypt from 'bcrypt';

/**
 * Auto-seed database with initial data if it's empty
 * This runs on server startup to ensure the system is ready to use
 */
const autoSeedDatabase = async () => {
  try {
    // Always ensure initial accounts exist on every restart
    console.log('📦 Ensuring initial data is available...');
    
    // Check if database already has categories
    const categoryCount = await Category.count();
    const hasData = categoryCount > 0;
    
    if (hasData) {
      console.log('✅ Database has existing data. Ensuring initial accounts...');
    } else {
      console.log('📦 Database is empty. Auto-seeding with initial data...');
    }

    // Set up associations
    User.hasOne(Provider, { foreignKey: 'user_id', as: 'provider' });

    // Create Admin User (if doesn't exist)
    let admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!admin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: adminPassword,
        role: 'admin',
      });
      console.log('✅ Created admin user');
    }

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
    ], { ignoreDuplicates: true });
    console.log('✅ Created customer users');

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
    ], { ignoreDuplicates: true });
    console.log('✅ Created provider users');

    // Create Provider records
    const providerUsers = await User.findAll({ where: { role: 'provider' } });
    for (const providerUser of providerUsers) {
      const existingProvider = await Provider.findOne({ where: { user_id: providerUser.id } });
      if (!existingProvider) {
        await Provider.create({
          user_id: providerUser.id,
          skills: 'Parcel delivery, Food delivery, Document delivery',
          availability: true,
        });
      }
    }
    console.log('✅ Created provider records');

    // Create Categories (only if database was empty)
    if (!hasData) {
      const categories = await Category.bulkCreate([
        { name: 'Parcel Delivery' },
        { name: 'Food Delivery' },
        { name: 'Document Delivery' },
        { name: 'Grocery Delivery' },
        { name: 'Express Delivery' },
        { name: 'Furniture & Heavy Items' },
      ], { ignoreDuplicates: true });
      console.log('✅ Created categories');
    } else {
      console.log('✅ Categories already exist');
    }

    // Get categories (in case they already existed)
    const allCategories = await Category.findAll();

    // Create Services with Sri Lankan pricing (only if database was empty)
    if (!hasData && allCategories.length > 0) {
      await Service.bulkCreate([
      // Parcel Delivery
      {
        category_id: allCategories[0].id,
        name: 'Standard Parcel Delivery (Colombo)',
        price: 5.00,
      },
      {
        category_id: allCategories[0].id,
        name: 'Standard Parcel Delivery (Other Cities)',
        price: 8.00,
      },
      {
        category_id: allCategories[0].id,
        name: 'Parcel Delivery (Up to 5kg)',
        price: 10.00,
      },
      {
        category_id: allCategories[0].id,
        name: 'Parcel Delivery (5-10kg)',
        price: 15.00,
      },
      {
        category_id: allCategories[0].id,
        name: 'Parcel Delivery (10-20kg)',
        price: 25.00,
      },
      
      // Food Delivery
      {
        category_id: allCategories[1].id,
        name: 'Food Delivery (Colombo)',
        price: 3.00,
      },
      {
        category_id: allCategories[1].id,
        name: 'Food Delivery (Suburbs)',
        price: 5.00,
      },
      {
        category_id: allCategories[1].id,
        name: 'Food Delivery (Express - 30 min)',
        price: 8.00,
      },
      
      // Document Delivery
      {
        category_id: allCategories[2].id,
        name: 'Document Delivery (Same Day)',
        price: 6.00,
      },
      {
        category_id: allCategories[2].id,
        name: 'Document Delivery (Express)',
        price: 10.00,
      },
      {
        category_id: allCategories[2].id,
        name: 'Legal Document Delivery',
        price: 15.00,
      },
      
      // Grocery Delivery
      {
        category_id: allCategories[3].id,
        name: 'Grocery Delivery (Small - Up to 10kg)',
        price: 4.00,
      },
      {
        category_id: allCategories[3].id,
        name: 'Grocery Delivery (Medium - 10-20kg)',
        price: 7.00,
      },
      {
        category_id: allCategories[3].id,
        name: 'Grocery Delivery (Large - 20kg+)',
        price: 12.00,
      },
      
      // Express Delivery
      {
        category_id: allCategories[4].id,
        name: 'Express Delivery (2 hours)',
        price: 20.00,
      },
      {
        category_id: allCategories[4].id,
        name: 'Express Delivery (1 hour)',
        price: 30.00,
      },
      {
        category_id: allCategories[4].id,
        name: 'Express Delivery (30 minutes)',
        price: 50.00,
      },
      
      // Furniture & Heavy Items
      {
        category_id: allCategories[5].id,
        name: 'Furniture Delivery (Small)',
        price: 25.00,
      },
      {
        category_id: allCategories[5].id,
        name: 'Furniture Delivery (Medium)',
        price: 40.00,
      },
      {
        category_id: allCategories[5].id,
        name: 'Furniture Delivery (Large)',
        price: 60.00,
      },
      {
        category_id: allCategories[5].id,
        name: 'Heavy Items Delivery (20-50kg)',
        price: 35.00,
      },
      ], { ignoreDuplicates: true });
      console.log('✅ Created services');
    } else {
      console.log('✅ Services already exist');
    }

    // Get customer and provider users for sample bookings
    const customerUsers = await User.findAll({ where: { role: 'customer' } });
    const providerUsersList = await User.findAll({ where: { role: 'provider' } });
    const allServices = await Service.findAll();

    // Create Sample Bookings with Sri Lankan locations (only if no bookings exist and database was empty)
    const bookingCount = await Booking.count();
    if (!hasData && bookingCount === 0 && customerUsers.length > 0 && providerUsersList.length > 0 && allServices.length > 0) {
      await Booking.bulkCreate([
        {
          customer_id: customerUsers[0].id,
          provider_id: providerUsersList[0].id,
          service_id: allServices[0].id,
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
          customer_id: customerUsers[1]?.id || customerUsers[0].id,
          provider_id: providerUsersList[1]?.id || providerUsersList[0].id,
          service_id: allServices[5]?.id || allServices[0].id,
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
          customer_id: customerUsers[2]?.id || customerUsers[0].id,
          service_id: allServices[2]?.id || allServices[0].id,
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
      ], { ignoreDuplicates: true });
      console.log('✅ Created sample bookings');
    }

    console.log('\n✅ Auto-seed completed successfully!');
    console.log('🇱🇰 System is ready with Sri Lankan sample data!');
    console.log('\n📋 Initial Accounts Created:');
    console.log('   Admin:    admin@example.com / admin123');
    console.log('   Customer: kamal@example.com / customer123');
    console.log('   Customer: nimal@example.com / customer123');
    console.log('   Customer: sunil@example.com / customer123');
    console.log('   Provider: ravi@example.com / provider123');
    console.log('   Provider: dilshan@example.com / provider123');
    console.log('   Provider: chaminda@example.com / provider123');
    
  } catch (error) {
    console.error('❌ Error during auto-seed:', error.message);
    // Don't throw - allow server to start even if seeding fails
    console.log('⚠️  Server will continue, but you may need to seed manually with: npm run seed');
  }
};

export default autoSeedDatabase;

