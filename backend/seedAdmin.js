const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Admin data to seed
const admins = [
  {
    username: 'admin',
    password: 'password123',
    name: 'Admin User',
    role: 'admin'
  }
];

// Seed admin users
const seedAdmins = async () => {
  try {
    console.log('Connecting to database...');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: admins[0].username });
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping creation.');
    } else {
      // Create the admin user
      await Admin.create(admins[0]);
      console.log('Admin user created successfully!');
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeder
seedAdmins();