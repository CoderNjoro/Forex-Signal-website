const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Activity = require('../src/models/Activity');
const connectDB = require('../src/config/database');

const fixExistingLogs = async () => {
  try {
    await connectDB();
    console.log('Fixing existing activity logs...');

    // Update logs with ::1 or 127.0.0.1 to Localhost
    const result = await Activity.updateMany(
      { 
        $or: [
          { ipAddress: '::1' },
          { ipAddress: '::ffff:127.0.0.1' },
          { ipAddress: '127.0.0.1' },
          { country: { $exists: false } },
          { country: '' }
        ]
      },
      {
        $set: {
          country: 'Localhost',
          countryCode: 'LOCAL'
        }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} logs.`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing logs:', error);
    process.exit(1);
  }
};

fixExistingLogs();
