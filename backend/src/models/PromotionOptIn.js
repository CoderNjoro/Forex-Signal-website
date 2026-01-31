const mongoose = require('mongoose');

const promotionOptInSchema = new mongoose.Schema({
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  optInDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Ensure a user can only opt in once per promotion
promotionOptInSchema.index({ promotion: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('PromotionOptIn', promotionOptInSchema);
