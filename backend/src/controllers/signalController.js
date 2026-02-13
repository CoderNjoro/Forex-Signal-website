const Signal = require('../models/Signal');
const Performance = require('../models/Performance');
const { getIO } = require('../socket/socket');
const logActivity = require('../utils/activityLogger');

// Helper to mask signal for free users
const maskSignal = (signal, user) => {
  if (!signal) return signal;
  
  // Convert to plain JS object safely
  let signalObj;
  if (typeof signal.toObject === 'function') {
    signalObj = signal.toObject();
  } else {
    // Re-stringify to be 100% sure we have a clean POJO
    signalObj = JSON.parse(JSON.stringify(signal));
  }
  
  const isPremiumSignal = signalObj.accessPlan === 'premium';
  
  // Determine if user is allowed to see premium content
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const isPremiumUser = user && (user.subscriptionType === 'premium');
  const isEligible = isAdmin || isPremiumUser;

  // We only mask active signals. Closed/Cancelled signals are historical and can be viewed.
  if (isPremiumSignal && !isEligible && signalObj.status === 'active') {
    console.log(`[MASKING] Signal ${signalObj.pair} masked for user ${user?.username || 'Guest'}`);
    return {
      ...signalObj,
      entryPrice: null,
      stopLoss: null,
      takeProfit: [],
      analysis: signalObj.analysis ? signalObj.analysis.substring(0, 50) + '... (Premium only)' : '',
      chartImage: null,
      isLocked: true
    };
  }
  
  return signalObj;
};

// @desc    Get all signals
// @route   GET /api/signals
// @access  Private
exports.getSignals = async (req, res) => {
  try {
    const {
      status,
      pair,
      type,
      timeframe,
      page = 1,
      limit = 20,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (pair) query.pair = pair.toUpperCase();
    if (type) query.type = type;
    if (timeframe) query.timeframe = timeframe;

    const signals = await Signal.find(query)
      .populate('adminId', 'username')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean() // Use lean for performance and modification
      .exec();

    const total = await Signal.countDocuments(query);

    // Mask signals for free users if it's a premium signal
    const sanitizedSignals = signals.map(signal => maskSignal(signal, req.user));

    res.json({
      signals: sanitizedSignals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single signal
// @route   GET /api/signals/:id
// @access  Private
exports.getSignal = async (req, res) => {
  try {
    let signal = await Signal.findById(req.params.id)
      .populate('adminId', 'username')
      .lean();

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    // Mask signal for free users if it's a premium signal
    signal = maskSignal(signal, req.user);

    res.json(signal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new signal
// @route   POST /api/signals
// @access  Private/Admin
exports.createSignal = async (req, res) => {
  try {
    const signalData = {
      ...req.body,
      adminId: req.user._id,
    };

    // Remove chartImage from body data to prevent "Cast to string" errors
    // if it accidentally comes through as an empty object
    delete signalData.chartImage;

    if (req.file) {
      signalData.chartImage = req.file.path.replace(/\\/g, '/');
    }

    const signal = await Signal.create(signalData);

    const populatedSignal = await Signal.findById(signal._id).populate(
      'adminId',
      'username'
    );

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: 'create_signal',
      details: `Created signal ${signal.pair} ${signal.type}`,
      req,
      metadata: { signalId: signal._id }
    });

    // Emit new signal using rooms for security
    const io = getIO();
    // 1. Send full signal to premium users and admins
    io.to('premium').emit('signal:new', populatedSignal);
    
    // 2. Send masked signal to free users
    const maskedSignal = maskSignal(populatedSignal.toObject ? populatedSignal.toObject() : populatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:new', maskedSignal);

    res.status(201).json(populatedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update signal
// @route   PUT /api/signals/:id
// @access  Private/Admin
exports.updateSignal = async (req, res) => {
  try {
    let signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    // Check if signal is being closed
    if (req.body.status === 'closed' && signal.status !== 'closed') {
      req.body.closedAt = new Date();
    }

    signal = await Signal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('adminId', 'username');

    // Update performance stats if signal was closed
    if (signal.status === 'closed') {
      const performance = await Performance.getPerformance();
      await performance.updateStats();
    }

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: 'update_signal',
      details: `Updated signal ${signal.pair}`,
      req,
      metadata: { signalId: signal._id, updates: req.body }
    });

    // Emit updated signal using rooms
    const io = getIO();
    let updateType = 'general';
    if (signal.status === 'closed') updateType = 'closed';
    
    // Broadcast to premium room
    io.to('premium').emit('signal:updated', { signal, updateType });
    
    // Broadcast to free room (masked)
    const maskedSignal = maskSignal(signal.toObject ? signal.toObject() : signal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType });

    res.json(signal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete signal
// @route   DELETE /api/signals/:id
// @access  Private/Admin
exports.deleteSignal = async (req, res) => {
  try {
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    await signal.deleteOne();
    res.json({ message: 'Signal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active signals
// @route   GET /api/signals/active
// @access  Private
exports.getActiveSignals = async (req, res) => {
  try {
    const signals = await Signal.find({ status: 'active' })
      .populate('adminId', 'username')
      .sort('-createdAt')
      .limit(50)
      .lean();

    // Mask signals for free users if it's a premium signal
    const sanitizedSignals = signals.map(signal => maskSignal(signal, req.user));

    res.json(sanitizedSignals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update signal TP hits
// @route   PUT /api/signals/:id/tp-hit
// @access  Private/Admin
exports.updateTPHit = async (req, res) => {
  try {
    const { tpIndex, isHit } = req.body;
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    if (tpIndex < 0 || tpIndex >= signal.takeProfit.length) {
      return res.status(400).json({ message: 'Invalid TP index' });
    }

    // Initialize tpHits array if not exists
    if (!signal.tpHits || signal.tpHits.length === 0) {
      signal.tpHits = new Array(signal.takeProfit.length).fill(false);
    }

    signal.tpHits[tpIndex] = isHit;
    
    // Check if all TPs are hit
    const allTPsHit = signal.tpHits.every(hit => hit === true);
    if (allTPsHit && signal.status === 'active') {
      signal.status = 'closed';
      signal.result = 'win';
      signal.closedAt = new Date();
      
      // Calculate pips if not set
      if (signal.pips === 0) {
        const lastTP = signal.takeProfit[signal.takeProfit.length - 1];
        signal.pips = Math.abs(lastTP - signal.entryPrice) * 10000; // Approximate pip calculation
      }
    }

    await signal.save();
    const updatedSignal = await Signal.findById(signal._id).populate('adminId', 'username');

    // Emit update using rooms
    const io = getIO();
    io.to('premium').emit('signal:updated', { signal: updatedSignal, updateType: 'tp_hit' });
    
    const maskedSignal = maskSignal(updatedSignal.toObject ? updatedSignal.toObject() : updatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType: 'tp_hit' });

    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark signal as SL hit
// @route   PUT /api/signals/:id/sl-hit
// @access  Private/Admin
exports.markSLHit = async (req, res) => {
  try {
    const { pips } = req.body;
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    signal.status = 'closed';
    signal.result = 'loss';
    signal.closedAt = new Date();
    signal.closingPrice = signal.stopLoss;
    
    if (pips !== undefined) {
      signal.pips = pips;
    } else {
      // Calculate negative pips
      signal.pips = -Math.abs(signal.stopLoss - signal.entryPrice) * 10000;
    }

    await signal.save();
    const updatedSignal = await Signal.findById(signal._id).populate('adminId', 'username');

    // Update performance stats
    const performance = await Performance.getPerformance();
    await performance.updateStats();

    // Emit update using rooms
    const io = getIO();
    io.to('premium').emit('signal:updated', { signal: updatedSignal, updateType: 'closed' });
    
    const maskedSignal = maskSignal(updatedSignal.toObject ? updatedSignal.toObject() : updatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType: 'closed' });

    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark signal as breakeven
// @route   PUT /api/signals/:id/breakeven
// @access  Private/Admin
exports.markBreakeven = async (req, res) => {
  try {
    const { breakEvenPrice } = req.body;
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    signal.isBreakeven = true;
    signal.breakEvenPrice = breakEvenPrice || signal.entryPrice;
    signal.status = 'closed';
    signal.result = 'breakeven';
    signal.closedAt = new Date();
    signal.closingPrice = signal.breakEvenPrice;
    signal.pips = 0;

    await signal.save();
    const updatedSignal = await Signal.findById(signal._id).populate('adminId', 'username');

    // Update performance stats
    const performance = await Performance.getPerformance();
    await performance.updateStats();

    // Emit update using rooms
    const io = getIO();
    io.to('premium').emit('signal:updated', { signal: updatedSignal, updateType: 'breakeven' });
    
    const maskedSignal = maskSignal(updatedSignal.toObject ? updatedSignal.toObject() : updatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType: 'breakeven' });

    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update signal closing details
// @route   PUT /api/signals/:id/close
// @access  Private/Admin
exports.closeSignal = async (req, res) => {
  try {
    const { closingPrice, result, pips } = req.body;
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    signal.status = 'closed';
    signal.closedAt = new Date();
    
    if (closingPrice) signal.closingPrice = closingPrice;
    if (result) signal.result = result;
    if (pips !== undefined) signal.pips = pips;

    await signal.save();
    const updatedSignal = await Signal.findById(signal._id).populate('adminId', 'username');

    // Update performance stats
    const performance = await Performance.getPerformance();
    await performance.updateStats();

    // Emit update using rooms
    const io = getIO();
    io.to('premium').emit('signal:updated', { signal: updatedSignal, updateType: 'closed' });
    
    const maskedSignal = maskSignal(updatedSignal.toObject ? updatedSignal.toObject() : updatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType: 'closed' });

    res.json(updatedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get signal statistics
// @route   GET /api/signals/stats
// @access  Private
exports.getSignalStats = async (req, res) => {
  try {
    // 1. Profitability over time (daily)
    const profitability = await Signal.aggregate([
      { $match: { status: 'closed', closedAt: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$closedAt" } },
          totalPips: { $sum: "$pips" },
          count: { $sum: 1 },
          wins: { $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] } },
          losses: { $sum: { $cond: [{ $eq: ["$result", "loss"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Currency Dominance (Circle Graph - based on volume and performance)
    const dominance = await Signal.aggregate([
      {
        $group: {
          _id: "$pair",
          count: { $sum: 1 },
          totalPips: { $sum: { $ifNull: ["$pips", 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
          totalPips: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Overall Win/Loss Stats
    const overall = await Signal.aggregate([
      { $match: { status: 'closed' } },
      {
        $group: {
          _id: null,
          totalSignals: { $sum: 1 },
          totalPips: { $sum: "$pips" },
          winCount: { $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] } },
          lossCount: { $sum: { $cond: [{ $eq: ["$result", "loss"] }, 1, 0] } },
          breakevenCount: { $sum: { $cond: [{ $eq: ["$result", "breakeven"] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      profitability,
      dominance,
      overall: overall[0] || {}
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on signal sentiment
// @route   PUT /api/signals/:id/vote
// @access  Private
exports.voteSignal = async (req, res) => {
  try {
    const { vote } = req.body; // 'bullish' or 'bearish'
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }

    if (!['bullish', 'bearish'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    // Initialize sentiment object if missing (migration)
    if (!signal.sentiment) {
      signal.sentiment = { bullish: [], bearish: [] };
    }

    // Remove user from previous votes
    signal.sentiment.bullish = signal.sentiment.bullish.filter(id => id.toString() !== req.user._id.toString());
    signal.sentiment.bearish = signal.sentiment.bearish.filter(id => id.toString() !== req.user._id.toString());

    // Add new vote
    if (vote === 'bullish') {
      signal.sentiment.bullish.push(req.user._id);
    } else {
      signal.sentiment.bearish.push(req.user._id);
    }

    await signal.save();

    const updatedSignal = await Signal.findById(signal._id).populate('adminId', 'username').lean();
    
    // Mask for the response
    const sanitizedSignal = maskSignal(updatedSignal, req.user);

    // Emit update using rooms
    const io = getIO();
    io.to('premium').emit('signal:updated', { signal: updatedSignal, updateType: 'vote' });
    
    const maskedSignal = maskSignal(updatedSignal, { role: 'user', subscriptionType: 'free' });
    io.to('free').emit('signal:updated', { signal: maskedSignal, updateType: 'vote' });

    res.json(sanitizedSignal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.maskSignal = maskSignal;
