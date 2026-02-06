const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// User Schema (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  isAdminBlocked: {
    type: Boolean,
    default: false,
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  canCreatePromotions: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// Superadmin credentials
const SUPERADMIN_DATA = {
  username: 'superadmin',
  email: 'admin@forex.com',
  password: 'Admin@123', // Change this to a secure password
  role: 'superadmin',
  subscriptionType: 'premium',
  isActive: true,
  canCreatePromotions: true,
};

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: SUPERADMIN_DATA.email },
        { username: SUPERADMIN_DATA.username }
      ]
    });

    if (existingAdmin) {
      console.log('⚠️  Superadmin already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Username:', existingAdmin.username);
      console.log('   Role:', existingAdmin.role);
      
      // Update to superadmin if exists but not superadmin
      if (existingAdmin.role !== 'superadmin') {
        console.log('🔄 Updating existing user to superadmin...');
        existingAdmin.role = 'superadmin';
        existingAdmin.canCreatePromotions = true;
        existingAdmin.subscriptionType = 'premium';
        existingAdmin.isActive = true;
        existingAdmin.isAdminBlocked = false;
        await existingAdmin.save({ validateBeforeSave: false });
        console.log('✅ User updated to superadmin successfully!');
      }
    } else {
      // Hash password
      console.log('🔐 Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SUPERADMIN_DATA.password, salt);

      // Create superadmin
      console.log('👤 Creating superadmin account...');
      const superadmin = await User.create({
        ...SUPERADMIN_DATA,
        password: hashedPassword,
      });

      console.log('✅ Superadmin created successfully!');
      console.log('📧 Email:', superadmin.email);
      console.log('👤 Username:', superadmin.username);
      console.log('🔑 Password:', SUPERADMIN_DATA.password);
      console.log('⚠️  IMPORTANT: Please change the password after first login!');
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    console.log('✨ Script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();
