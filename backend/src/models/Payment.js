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

module.exports = mongoose.model('Payment', paymentSchema);
