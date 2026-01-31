const mongoose = require('mongoose');

const forumReplySchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumTopic',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide a reply content'],
    trim: true,
    maxlength: [5000, 'Reply cannot exceed 5000 characters'],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

forumReplySchema.index({ topic: 1, createdAt: 1 });

module.exports = mongoose.model('ForumReply', forumReplySchema);