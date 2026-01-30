require('dotenv').config();
const mongoose = require('mongoose');

async function checkDB() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');
    console.log('Database:', mongoose.connection.name);
    
    const User = require('./src/models/User');
    const Signal = require('./src/models/Signal');
    
    const userCount = await User.countDocuments();
    const signalCount = await Signal.countDocuments();
    
    console.log('\nUsers in DB:', userCount);
    console.log('Signals in DB:', signalCount);
    
    if (userCount > 0) {
      const users = await User.find().select('username email role createdAt');
      console.log('\nUsers:');
      users.forEach(u => console.log(`- ${u.username} (${u.email}) - ${u.role}`));
    }
    
    if (signalCount > 0) {
      const signals = await Signal.find().limit(3);
      console.log('\nSignals:');
      signals.forEach(s => console.log(`- ${s.pair} ${s.type} - ${s.status}`));
    }
    
    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkDB();
