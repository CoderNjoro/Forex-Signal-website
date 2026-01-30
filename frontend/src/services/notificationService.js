// Notification service for browser push notifications
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.checkPermission();
  }

  /**
   * Check current notification permission
   */
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Show a browser notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   */
  async show(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission not granted');
        return null;
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options,
      });

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show notification for new signal
   * @param {Object} signal - Signal data
   */
  showNewSignal(signal) {
    return this.show('🚀 New Trading Signal!', {
      body: `${signal.pair} - ${signal.type.toUpperCase()}\nEntry: ${signal.entryPrice}\nSL: ${signal.stopLoss}`,
      tag: `signal-${signal._id}`,
      requireInteraction: true,
      data: { signalId: signal._id, type: 'new_signal' },
    });
  }

  /**
   * Show notification for signal update
   * @param {Object} signal - Signal data
   * @param {string} updateType - Type of update
   */
  showSignalUpdate(signal, updateType) {
    let title = '';
    let body = '';

    switch (updateType) {
      case 'tp_hit':
        title = '✅ Take Profit Hit!';
        body = `${signal.pair} - TP level reached`;
        break;
      case 'breakeven':
        title = '🔒 Moved to Breakeven';
        body = `${signal.pair} - Stop loss moved to breakeven`;
        break;
      case 'closed':
        title = '🏁 Signal Closed';
        body = `${signal.pair} - Result: ${signal.result?.toUpperCase() || 'N/A'}`;
        break;
      default:
        title = '📊 Signal Updated';
        body = `${signal.pair} has been updated`;
    }

    return this.show(title, {
      body,
      tag: `signal-update-${signal._id}`,
      data: { signalId: signal._id, type: updateType },
    });
  }

  /**
   * Show notification for new comment
   * @param {Object} comment - Comment data
   * @param {Object} signal - Signal data
   */
  showNewComment(comment, signal) {
    return this.show('💬 New Comment', {
      body: `${comment.userId?.username || 'Someone'} commented on ${signal.pair}`,
      tag: `comment-${comment._id}`,
      data: { signalId: signal._id, commentId: comment._id, type: 'new_comment' },
    });
  }

  /**
   * Show notification for admin announcement
   * @param {string} message - Announcement message
   */
  showAnnouncement(message) {
    return this.show('📢 Announcement', {
      body: message,
      tag: 'announcement',
      requireInteraction: true,
      data: { type: 'announcement' },
    });
  }

  /**
   * Check if notifications are supported
   */
  isSupported() {
    return 'Notification' in window;
  }

  /**
   * Check if permission is granted
   */
  isGranted() {
    return this.permission === 'granted';
  }
}

export const notificationService = new NotificationService();
export default notificationService;
