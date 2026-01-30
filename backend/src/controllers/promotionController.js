const Promotion = require('../models/Promotion');
const logActivity = require('../utils/activityLogger');

// @desc    Get all active promotions
// @route   GET /api/promotions
// @access  Private
exports.getPromotions = async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      endDate: { $gt: now },
      startDate: { $lte: now }
    }).sort('-createdAt');

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all promotions (Admin only)
// @route   GET /api/promotions/admin
// @access  Private/Admin
exports.getAllPromotionsAdmin = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort('-createdAt');
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
exports.createPromotion = async (req, res) => {
  try {
    // Check if user is superadmin or has special permission
    if (req.user.role !== 'superadmin' && !req.user.canCreatePromotions) {
      return res.status(403).json({ message: 'You do not have permission to create promotions. Please contact SuperAdmin.' });
    }

    const promotionData = {
      ...req.body,
      createdBy: req.user._id,
    };

    if (req.file) {
      promotionData.image = req.file.path.replace(/\\/g, '/');
    }

    const promotion = await Promotion.create(promotionData);

    await logActivity({
      userId: req.user._id,
      action: 'create_promotion',
      details: `Created promotion: ${promotion.title}`,
      req,
      metadata: { promotionId: promotion._id }
    });

    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
exports.updatePromotion = async (req, res) => {
  try {
    // Check if user is superadmin or has special permission
    if (req.user.role !== 'superadmin' && !req.user.canCreatePromotions) {
      return res.status(403).json({ message: 'You do not have permission to modify promotions.' });
    }

    let promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, '/');
    }

    promotion = await Promotion.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    await logActivity({
      userId: req.user._id,
      action: 'update_promotion',
      details: `Updated promotion: ${promotion.title}`,
      req,
      metadata: { promotionId: promotion._id }
    });

    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
exports.deletePromotion = async (req, res) => {
  try {
    // Check if user is superadmin or has special permission
    if (req.user.role !== 'superadmin' && !req.user.canCreatePromotions) {
      return res.status(403).json({ message: 'You do not have permission to delete promotions.' });
    }

    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    await promotion.deleteOne();

    await logActivity({
      userId: req.user._id,
      action: 'delete_promotion',
      details: `Deleted promotion: ${promotion.title}`,
      req,
      metadata: { promotionId: req.params.id }
    });

    res.json({ message: 'Promotion removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
