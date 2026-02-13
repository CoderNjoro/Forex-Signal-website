const Settings = require('../models/Settings');
const logActivity = require('../utils/activityLogger');

// @desc    Get settings (public - for subscription page)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscription prices
// @route   PUT /api/settings/subscription-price
// @access  Private/Superadmin
exports.updateSubscriptionPrice = async (req, res) => {
  try {
    const { usd, kes } = req.body;

    if (usd !== undefined && (isNaN(usd) || usd < 0)) {
      return res.status(400).json({ message: 'USD price must be a valid positive number' });
    }

    if (kes !== undefined && (isNaN(kes) || kes < 0)) {
      return res.status(400).json({ message: 'KES price must be a valid positive number' });
    }

    const settings = await Settings.getSettings();
    
    if (usd !== undefined) {
      settings.premiumSubscriptionPrice.usd = usd;
    }
    if (kes !== undefined) {
      settings.premiumSubscriptionPrice.kes = kes;
    }

    await settings.save();

    await logActivity({
      userId: req.user._id,
      action: 'update_subscription_price',
      details: `Updated subscription price: USD $${settings.premiumSubscriptionPrice.usd}, KES ${settings.premiumSubscriptionPrice.kes}`,
      req,
    });

    res.json({
      message: 'Subscription price updated successfully',
      premiumSubscriptionPrice: settings.premiumSubscriptionPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update crypto settings
// @route   PUT /api/superadmin/settings/crypto
// @access  Private/Superadmin
exports.updateCryptoSettings = async (req, res) => {
  try {
    const { usdtAddress, network, walletLabel } = req.body;

    const settings = await Settings.getSettings();
    
    if (usdtAddress !== undefined) settings.cryptoSettings.usdtAddress = usdtAddress;
    if (network !== undefined) settings.cryptoSettings.network = network;
    if (walletLabel !== undefined) settings.cryptoSettings.walletLabel = walletLabel;

    await settings.save();

    await logActivity({
      userId: req.user._id,
      action: 'update_crypto_settings',
      details: `Updated crypto settings: Address: ${usdtAddress}, Network: ${network}`,
      req,
    });

    res.json({
      message: 'Crypto settings updated successfully',
      cryptoSettings: settings.cryptoSettings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

