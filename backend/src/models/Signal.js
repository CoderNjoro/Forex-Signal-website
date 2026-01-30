const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  pair: {
    type: String,
    required: [true, 'Please provide a currency pair'],
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['buy', 'sell', 'buy limit', 'sell limit'],
    required: [true, 'Please specify signal type'],
  },
  accessPlan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  entryPrice: {
    type: Number,
    required: [true, 'Please provide entry price'],
  },
  stopLoss: {
    type: Number,
    required: [true, 'Please provide stop loss'],
  },
  takeProfit: {
    type: [Number],
    required: [true, 'Please provide take profit levels'],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one take profit level is required',
    },
  },
  tpHits: {
    type: [Boolean],
    default: [],
  },
  isBreakeven: {
    type: Boolean,
    default: false,
  },
  breakEvenPrice: {
    type: Number,
  },
  closingPrice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'cancelled'],
    default: 'active',
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'breakeven', 'pending'],
    default: 'pending',
  },
  pips: {
    type: Number,
    default: 0,
  },
  analysis: {
    type: String,
    trim: true,
  },
  timeframe: {
    type: String,
    enum: ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'],
    default: 'H1',
  },
  closedAt: {
    type: Date,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chartImage: {
    type: String, // Path to the uploaded image
    default: null,
  },
  sentiment: {
    bullish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bearish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
signalSchema.index({ status: 1, createdAt: -1 });
signalSchema.index({ pair: 1, status: 1 });

module.exports = mongoose.model('Signal', signalSchema);


