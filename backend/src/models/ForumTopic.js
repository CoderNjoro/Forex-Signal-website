const mongoose = require('mongoose');

const CATEGORIES = ['geopolitics', 'monetary_policy', 'trade', 'energy', 'commodities', 'macro'];

const forumTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a topic title'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide a topic content'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters'],
  },
  category: {
    type: String,
    enum: CATEGORIES,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  replyCount: {
    type: Number,
    default: 0,
  },
  lastReplyAt: {
    type: Date,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

forumTopicSchema.index({ category: 1, pinned: -1, createdAt: -1 });
forumTopicSchema.index({ pinned: -1, lastReplyAt: -1 });

module.exports = mongoose.model('ForumTopic', forumTopicSchema);