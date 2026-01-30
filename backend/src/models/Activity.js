const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'register',
      'login',
      'logout',
      'create_signal',
      'update_signal',
      'delete_signal',
      'update_profile',
      'create_admin',
      'block_admin',
      'unblock_admin',
      'other'
    ],
  },
  details: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Index for faster queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
