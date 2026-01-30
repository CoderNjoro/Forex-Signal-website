#!/usr/bin/env node

/**
 * Database Diagnostic Script
 * Checks MongoDB connection and displays current data
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function diagnose() {
  console.log('🔍 Database Diagnostic Tool\n');
  console.log('=' .repeat(60));
  
  try {
    // Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set');
    console.log('Database Name:', process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.split('/').pop().split('?')[0] : 'N/A');
    
    // Connect to database
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected successfully!');
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    
    // Load models
    const User = require('./src/models/User');
    const Signal = require('./src/models/Signal');
    const Performance = require('./src/models/Performance');
    
    // Check collections
    console.log('\n📊 Database Statistics:');
    console.log('=' .repeat(60));
    
    // Users
    const userCount = await User.countDocuments();
    console.log(`\n👥 Users: ${userCount}`);
    if (userCount > 0) {
      const users = await User.find().select('-password').limit(5);
      console.log('\nRecent users:');
      users.forEach((user, i) => {
        console.log(`  ${i + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
        console.log(`     Created: ${user.createdAt}`);
      });
    } else {
      console.log('  ⚠️  No users found in database!');
    }
    
    // Signals
    const signalCount = await Signal.countDocuments();
    console.log(`\n📈 Signals: ${signalCount}`);
    if (signalCount > 0) {
      const signals = await Signal.find().limit(5);
      console.log('\nRecent signals:');
      signals.forEach((signal, i) => {
        console.log(`  ${i + 1}. ${signal.pair} ${signal.type.toUpperCase()} - Status: ${signal.status}`);
        console.log(`     Created: ${signal.createdAt}`);
      });
    } else {
      console.log('  ⚠️  No signals found in database!');
    }
    
    // Performance
    const perfCount = await Performance.countDocuments();
    console.log(`\n📊 Performance Records: ${perfCount}`);
    
    // Check indexes
    console.log('\n🔍 Checking Indexes:');
    const userIndexes = await User.collection.getIndexes();
    const signalIndexes = await Signal.collection.getIndexes();
    console.log('User indexes:', Object.keys(userIndexes).length);
    console.log('Signal indexes:', Object.keys(signalIndexes).length);
    
    // Test write operation
    console.log('\n✍️  Testing Write Operations:');
    console.log('Attempting to create a test user...');
    
    const testEmail = `test_${Date.now()}@example.com`;
    try {
      const testUser = await User.create({
        username: `testuser_${Date.now()}`,
        email: testEmail,
        password: 'Test123!@#',
      });
      console.log('✓ Test user created successfully!');
      console.log('  ID:', testUser._id);
      console.log('  Username:', testUser.username);
      
      // Clean up test user
      await User.findByIdAndDelete(testUser._id);
      console.log('✓ Test user deleted (cleanup)');
    } catch (error) {
      console.log('✗ Failed to create test user:', error.message);
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n✅ Diagnostic Complete!\n');
    
    // Recommendations
    console.log('📝 Recommendations:');
    if (userCount === 0) {
      console.log('  ⚠️  No users in database - Registration may not be working');
      console.log('  → Check if registration endpoint is being called');
      console.log('  → Check for errors in backend logs');
    }
    if (signalCount === 0) {
      console.log('  ⚠️  No signals in database');
      console.log('  → Create signals from admin panel to test');
    }
    if (userCount > 0 && signalCount > 0) {
      console.log('  ✓ Database is working correctly!');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

diagnose();
