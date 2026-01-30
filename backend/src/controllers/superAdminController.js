const User = require('../models/User');
const Signal = require('../models/Signal');
const Activity = require('../models/Activity');
const logActivity = require('../utils/activityLogger');

// @desc    Get all admins
// @route   GET /api/superadmin/admins
// @access  Private/Superadmin
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort('-createdAt');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new admin
// @route   POST /api/superadmin/admins
// @access  Private/Superadmin
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const admin = await User.create({
      username,
      email,
      password,
      role: 'admin',
      isActive: true,
      isAdminBlocked: false
    });

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: 'create_admin',
      details: `Created new admin: ${admin.username} (${admin.email})`,
      req
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle admin block status
// @route   PATCH /api/superadmin/admins/:id/block
// @access  Private/Superadmin
exports.toggleAdminBlock = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.isAdminBlocked = !admin.isAdminBlocked;
    await admin.save();

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: admin.isAdminBlocked ? 'block_admin' : 'unblock_admin',
      details: `${admin.isAdminBlocked ? 'Blocked' : 'Unblocked'} admin: ${admin.username}`,
      req
    });

    res.json({
      _id: admin._id,
      username: admin.username,
      isAdminBlocked: admin.isAdminBlocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle admin promotion permission
// @route   PATCH /api/superadmin/admins/:id/promotion-perm
// @access  Private/Superadmin
exports.togglePromotionPermission = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.canCreatePromotions = !admin.canCreatePromotions;
    await admin.save();

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: admin.canCreatePromotions ? 'grant_promo_perm' : 'revoke_promo_perm',
      details: `${admin.canCreatePromotions ? 'Granted' : 'Revoked'} promotion permission for admin: ${admin.username}`,
      req
    });

    res.json({
      _id: admin._id,
      username: admin.username,
      canCreatePromotions: admin.canCreatePromotions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all subscriptions and overview
// @route   GET /api/superadmin/overview
// @access  Private/Superadmin
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const premiumUsers = await User.countDocuments({ role: 'user', subscriptionType: 'premium' });
    const freeUsers = await User.countDocuments({ role: 'user', subscriptionType: 'free' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Recent activities across all admins
    const recentActivities = await Activity.find()
      .populate('user', 'username email role')
      .sort('-createdAt')
      .limit(10);

    res.json({
      totalUsers,
      premiumUsers,
      freeUsers,
      totalAdmins,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
