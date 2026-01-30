const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    if (req.user.role === 'admin' && req.user.isAdminBlocked) {
      return res.status(403).json({ message: 'Your admin access has been blocked. Please contact the superadmin.' });
    }
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { admin };


