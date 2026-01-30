const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a promotion title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide promotion content/terms'],
  },
  image: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

// Index for performance
promotionSchema.index({ isActive: 1, endDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);
