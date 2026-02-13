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
  cryptoSettings: {
    usdtAddress: {
      type: String,
      default: '',
    },
    network: {
      type: String,
      default: 'TRC20', // USDT TRC20 is most common for low fees
    },
    walletLabel: {
      type: String,
      default: 'USDT (TRC20)',
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
