const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please provide comment content'],
    trim: true,
    maxlength: [500, 'Comment cannot differ 500 characters'],
  },
  signalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signal',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
commentSchema.index({ signalId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
