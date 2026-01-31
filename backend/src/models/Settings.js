const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  premiumSubscriptionPrice: {
    usd: {
      type: Number,
      default: 10,
      min: [0, 'Price cannot be negative'],
    },
    kes: {
      type: Number,
      default: 1300,
      min: [0, 'Price cannot be negative'],
    },
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
