const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Try loading from multiple locations
const envPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '../.env'),
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'backend/.env')
];

let loaded = false;
for (const p of envPaths) {
    const result = dotenv.config({ path: p });
    if (!result.error) {
        console.log(`Loaded .env from: ${p}`);
        loaded = true;
        break; 
    }
}

const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('ERROR: DATABASE_URL or MONGODB_URI not found in environment variables.');
    console.error('Tried paths:', envPaths);
    process.exit(1);
}

const Settings = require('./src/models/Settings');

const checkSettings = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const count = await Settings.countDocuments();
    console.log(`Total Settings documents: ${count}`);
    
    // ... rest of logic ... 
    
    // Just fetch and log the current price for now
    const settings = await Settings.findOne();
    if (settings) {
        console.log('Current Premium Price:', settings.premiumSubscriptionPrice);
    } else {
        console.log('No Settings found!');
        await Settings.create({});
        console.log('Created default settings.');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkSettings();
