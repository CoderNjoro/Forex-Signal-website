const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  totalSignals: {
    type: Number,
    default: 0,
  },
  winRate: {
    type: Number,
    default: 0,
  },
  totalPips: {
    type: Number,
    default: 0,
  },
  monthlyStats: {
    type: Map,
    of: {
      signals: Number,
      wins: Number,
      losses: Number,
      pips: Number,
    },
    default: {},
  },
}, {
  timestamps: true,
});

// Static method to get or create performance document
performanceSchema.statics.getPerformance = async function () {
  let performance = await this.findOne();
  if (!performance) {
    performance = await this.create({});
  }
  return performance;
};

// Method to update performance stats
performanceSchema.methods.updateStats = async function () {
  const Signal = require('./Signal');
  
  const totalSignals = await Signal.countDocuments({ status: 'closed' });
  const wins = await Signal.countDocuments({ status: 'closed', result: 'win' });
  const losses = await Signal.countDocuments({ status: 'closed', result: 'loss' });
  
  const winRate = totalSignals > 0 ? (wins / totalSignals) * 100 : 0;
  
  const pipsResult = await Signal.aggregate([
    { $match: { status: 'closed' } },
    { $group: { _id: null, total: { $sum: '$pips' } } },
  ]);
  
  const totalPips = pipsResult.length > 0 ? pipsResult[0].total : 0;
  
  this.totalSignals = totalSignals;
  this.winRate = winRate;
  this.totalPips = totalPips;
  
  await this.save();
};

module.exports = mongoose.model('Performance', performanceSchema);

