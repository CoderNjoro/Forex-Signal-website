const Comment = require('../models/Comment');
const Signal = require('../models/Signal');
const { getIO } = require('../socket/socket');
const { maskSignal } = require('./signalController');

// @desc    Get comments for a signal
// @route   GET /api/comments/signal/:signalId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ signalId: req.params.signalId })
      .populate('userId', 'username')
      .sort('-createdAt');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { content, signalId } = req.body;

    const signal = await Signal.findById(signalId);
    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    const comment = await Comment.create({
      content,
      signalId,
      userId: req.user._id,
    });

    // Increment comment count on signal
    await Signal.findByIdAndUpdate(signalId, { $inc: { commentsCount: 1 } });

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'username'
    );

    // Emit new comment event
    const io = getIO();
    
    // 1. Send full signal to premium users and admins
    io.to('premium').emit('comment:new', { signalId, signal, comment: populatedComment });
    
    // 2. Send masked signal to free users
    const maskedSignal = maskSignal(signal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('comment:new', { signalId, signal: maskedSignal, comment: populatedComment });
    
    // Also emit an update for the signal itself so count updates in the list
    io.emit('signal:comment_count', { signalId, commentsCount: signal.commentsCount + 1 });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private/Admin or Owner
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized. Only admins can delete comments.' });
    }

    await comment.deleteOne();

    // Decrement comment count on signal
    await Signal.findByIdAndUpdate(comment.signalId, { $inc: { commentsCount: -1 } });
    const updatedSignal = await Signal.findById(comment.signalId);

    // Emit delete comment event
    const io = getIO();
    io.emit('comment:deleted', { signalId: comment.signalId, commentId: comment._id });
    
    // Also emit an update for the signal itself so count updates in the list
    io.emit('signal:comment_count', { signalId: comment.signalId, commentsCount: updatedSignal ? updatedSignal.commentsCount : 0 });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
