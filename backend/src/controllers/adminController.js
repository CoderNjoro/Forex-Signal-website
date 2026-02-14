const User = require('../models/User');
const Signal = require('../models/Signal');
const Performance = require('../models/Performance');
const Activity = require('../models/Activity');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { role, subscriptionType, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldSub = user.subscriptionType;
    if (role) user.role = role;
    if (subscriptionType) user.subscriptionType = subscriptionType;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    const updatedUser = await user.save();

    // Log the change
    await logActivity({
      userId: req.user._id,
      action: 'update_profile',
      details: `Updated user ${user.username}: role=${role || user.role}, sub=${subscriptionType || user.subscriptionType}`,
      req,
      metadata: { targetUserId: user._id }
    });

    // If subscription was upgraded manually, also log subscription_upgraded for the target user
    if (subscriptionType === 'premium' && oldSub !== 'premium') {
        await logActivity({
            userId: user._id,
            action: 'subscription_upgraded',
            details: `Subscription upgraded to Premium by administrator ${req.user.username}`,
            req
        });
    }

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      subscriptionType: updatedUser.subscriptionType,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'superadmin') {
      return res.status(400).json({ message: 'Cannot delete superadmin user' });
    }

    if (user.role === 'admin' && req.user.role !== 'superadmin') {
      return res.status(400).json({ message: 'Only superadmin can delete admin users' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSignals = await Signal.countDocuments();
    const activeSignals = await Signal.countDocuments({ status: 'active' });
    const closedSignals = await Signal.countDocuments({ status: 'closed' });

    const performance = await Performance.getPerformance();
    await performance.updateStats();

    const recentSignals = await Signal.find()
      .populate('adminId', 'username')
      .sort('-createdAt')
      .limit(10);

    res.json({
      totalUsers,
      totalSignals,
      activeSignals,
      closedSignals,
      winRate: performance.winRate,
      totalPips: performance.totalPips,
      recentSignals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get performance data
// @route   GET /api/admin/performance
// @access  Private/Admin
exports.getPerformance = async (req, res) => {
  try {
    const performance = await Performance.getPerformance();
    await performance.updateStats();

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activity logs
// @route   GET /api/admin/activity
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin privileges required.' });
    }

    const { page = 1, limit = 50 } = req.query;

    const activities = await Activity.find()
      .populate('user', 'username email role')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Activity.countDocuments();

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


