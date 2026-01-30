const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../src/models/User');
const connectDB = require('../src/config/database');

const createSuperAdmin = async () => {
  try {
    await connectDB();

    const email = process.argv[2];
    const password = process.argv[3];
    const username = process.argv[4];

    if (!email || !password || !username) {
      console.log('Please provide email, password and username');
      console.log('Usage: node createSuperAdmin.js <email> <password> <username>');
      process.exit(1);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      userExists.role = 'superadmin';
      await userExists.save();
      console.log('User promoted to Superadmin successfully');
    } else {
      const user = await User.create({
        username,
        email,
        password,
        role: 'superadmin',
        isActive: true
      });
      console.log('Superadmin created successfully:', user.email);
    }

    process.exit();
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
