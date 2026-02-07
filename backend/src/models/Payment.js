const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['USD', 'KES'],
    default: 'USD',
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'crypto'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: {
    type: String, // For M-Pesa
  },
  cryptoAddress: {
    type: String, // For Crypto
  },
  screenshot: {
    type: String, // Optional for crypto manual confirmation
  },
  checkoutRequestID: {
    type: String, // For M-Pesa STK Push
  }
}, {
  timestamps: true,
});

paymentSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(doc.user);
      if (user && user.subscriptionType !== 'premium') {
        user.subscriptionType = 'premium';
        
        // Set lifetime access (99 years)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 99);
        user.subscriptionExpiresAt = expiryDate;
        
        await user.save();
        console.log(`[SUBSCRIPTION] User ${user.username} upgraded to premium via payment ${doc._id}`);
      }
    } catch (error) {
      console.error('Error upgrading user subscription:', error);
    }
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
