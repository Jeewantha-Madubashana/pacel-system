import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Default configuration
const defaultEnv = `PORT=5000
DB_HOST=localhost
DB_PORT=3000
DB_USER=root
DB_PASSWORD=ptutrandecesten
DB_NAME=parcel_delivery
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
`;

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file with default configuration...');
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env file created successfully!');
  console.log('📝 Default MySQL configuration:');
  console.log('   Host: localhost');
  console.log('   Port: 3000');
  console.log('   User: root');
  console.log('   Password: ptutrandecesten');
  console.log('   Database: parcel_delivery');
  console.log('\n💡 You can modify backend/.env if needed.');
} else {
  console.log('✅ .env file already exists.');
}

// Also create .env.example if it doesn't exist
if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, defaultEnv);
  console.log('✅ .env.example file created.');
}

