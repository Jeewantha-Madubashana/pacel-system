import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createDatabaseIfNotExists = async () => {
  const dbName = process.env.DB_NAME || 'parcel_delivery';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT) || 3000;

  try {
    // Connect to MySQL server without specifying database
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });

    console.log('Connected to MySQL server...');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' is ready (created if it didn't exist)`);

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
};

export default createDatabaseIfNotExists;

