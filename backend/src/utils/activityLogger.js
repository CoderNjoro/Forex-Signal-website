const Activity = require('../models/Activity');
const axios = require('axios');

/**
 * Log a user activity
 * @param {Object} params - Activity parameters
 * @param {string} params.userId - User ID
 * @param {string} params.action - Action type
 * @param {string} [params.details] - Description of activity
 * @param {Object} [params.req] - Express request object (to extract IP/UserAgent)
 * @param {Object} [params.metadata] - Additional data
 */
const logActivity = async ({ userId, action, details, req, metadata }) => {
  try {
    const activityData = {
      user: userId,
      action,
      details,
      metadata,
    };

    if (req) {
      // Get IP address, handling proxy headers (X-Forwarded-For)
      let ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || req.connection.remoteAddress;
      
      // Handle IPv6 loopback
      if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === 'localhost') {
        ip = '127.0.0.1';
      }
      
      activityData.ipAddress = ip;
      activityData.userAgent = req.headers['user-agent'];

      // Check if it's a private/local IP range
      const isLocal = ip === '127.0.0.1' || 
                      ip.startsWith('192.168.') || 
                      ip.startsWith('10.') || 
                      ip.startsWith('172.');

      // Fetch Geolocation data
      if (!isLocal) {
        try {
          const geoResponse = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode`);
          if (geoResponse.data.status === 'success') {
            activityData.country = geoResponse.data.country;
            activityData.countryCode = geoResponse.data.countryCode;
          } else {
            activityData.country = 'Unknown Location';
            activityData.countryCode = 'UN';
          }
        } catch (geoError) {
          console.error('Failed to fetch geo data:', geoError.message);
          activityData.country = 'Geolocation Error';
          activityData.countryCode = 'UN';
        }
      } else {
        activityData.country = 'Local Network';
        activityData.countryCode = 'LOCAL';
      }
    }

    await Activity.create(activityData);
  } catch (error) {
    console.error('Failed to log activity:', error.message);
    // Don't throw error to prevent disrupting the main flow
  }
};

module.exports = logActivity;
