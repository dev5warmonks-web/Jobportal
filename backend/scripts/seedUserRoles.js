
const mongoose = require('mongoose');
const UserRole = require('../models/UserRole');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config({ path: './config.env' });

connectDB();

const roles = [
  { name: 'super admin', description: 'Super Administrator' },
  { name: 'admin', description: 'Administrator' },
  { name: 'employer', description: 'Employer' },
  { name: 'candidate', description: 'Candidate' }
];

const seedUserRoles = async () => {
  try {
    await UserRole.deleteMany({});
    console.log('User roles cleared');

    await UserRole.insertMany(roles);
    console.log('User roles seeded');

    process.exit();
  } catch (error) {
    console.error('Error seeding user roles:', error);
    process.exit(1);
  }
};

seedUserRoles();
