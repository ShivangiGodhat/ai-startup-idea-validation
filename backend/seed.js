const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users to prevent duplicate key errors during seeding
    await User.deleteMany({});
    console.log('Cleared existing users.');

    // Seed Admin User
    await User.create({
      name: 'System Administrator',
      email: 'admin@startupsense.ai',
      password: 'adminpassword',
      role: 'admin',
    });
    console.log('Seeded Admin User: admin@startupsense.ai / adminpassword');

    // Seed Demo Entrepreneur
    await User.create({
      name: 'Jane Entrepreneur',
      email: 'user@startupsense.ai',
      password: 'userpassword',
      role: 'user',
    });
    console.log('Seeded Test User: user@startupsense.ai / userpassword');

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedUsers();
