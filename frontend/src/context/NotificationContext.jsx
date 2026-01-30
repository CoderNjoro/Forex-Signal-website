import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/constants';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user && token) {
      const socketUrl = API_URL.replace('/api', '');
      const newSocket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      // Listen for new signals
      newSocket.on('signal:new', (signal) => {
        console.log('New signal received:', signal);
        handleNewSignal(signal);
      });

      // Listen for signal updates
      newSocket.on('signal:updated', (data) => {
        console.log('Signal updated:', data);
        // Don't show notification for votes
        if (data.updateType !== 'vote') {
          handleSignalUpdate(data.signal, data.updateType);
        }
      });

      // Listen for new comments
      newSocket.on('comment:new', (data) => {
        console.log('New comment:', data);
        handleNewComment(data.comment, data.signal);
      });

      // Listen for announcements
      newSocket.on('announcement', (message) => {
        console.log('Announcement:', message);
        handleAnnouncement(message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  // Handle new signal
  const handleNewSignal = (signal) => {
    const notification = {
      id: `signal-${signal._id}-${Date.now()}`,
      type: 'new_signal',
      title: '🚀 New Trading Signal!',
      message: `${signal.pair} - ${signal.type.toUpperCase()}`,
      data: signal,
      timestamp: new Date(),
      read: false,
    };

    addNotification(notification);

    // Show browser notification if enabled
    if (notificationsEnabled && notificationService.isGranted()) {
      notificationService.showNewSignal(signal);
    }

    // Show toast
    toast.success(`New signal: ${signal.pair} - ${signal.type.toUpperCase()}`, {
      duration: 5000,
      icon: '🚀',
    });
  };

  // Handle signal update
  const handleSignalUpdate = (signal, updateType) => {
    const notification = {
      id: `update-${signal._id}-${Date.now()}`,
      type: 'signal_update',
      title: getUpdateTitle(updateType),
      message: `${signal.pair} - ${getUpdateMessage(updateType)}`,
      data: { signal, updateType },
      timestamp: new Date(),
      read: false,
    };

    addNotification(notification);

    // Show browser notification if enabled
    if (notificationsEnabled && notificationService.isGranted()) {
      notificationService.showSignalUpdate(signal, updateType);
    }

    // Show toast
    toast.success(notification.message, {
      duration: 4000,
      icon: getUpdateIcon(updateType),
    });
  };

  // Handle new comment
  const handleNewComment = (comment, signal) => {
    // Only notify admins about new comments
    if (user?.role !== 'admin') return;

    const notification = {
      id: `comment-${comment._id}-${Date.now()}`,
      type: 'new_comment',
      title: '💬 New Comment',
      message: `${comment.userId?.username || 'Someone'} commented on ${signal.pair}`,
      data: { comment, signal },
      timestamp: new Date(),
      read: false,
    };

    addNotification(notification);

    // Show browser notification if enabled
    if (notificationsEnabled && notificationService.isGranted()) {
      notificationService.showNewComment(comment, signal);
    }
  };

  // Handle announcement
  const handleAnnouncement = (message) => {
    const notification = {
      id: `announcement-${Date.now()}`,
      type: 'announcement',
      title: '📢 Announcement',
      message,
      timestamp: new Date(),
      read: false,
    };

    addNotification(notification);

    // Show browser notification if enabled
    if (notificationsEnabled && notificationService.isGranted()) {
      notificationService.showAnnouncement(message);
    }

    // Show toast
    toast(message, {
      duration: 6000,
      icon: '📢',
    });
  };

  // Add notification to list
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount((prev) => prev + 1);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Request notification permission
  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
      toast.success('Notifications enabled!');
    } else {
      toast.error('Notification permission denied');
    }
    return granted;
  };

  // Toggle notifications
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      return granted;
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      toast.success('Notifications disabled');
      return false;
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    notificationsEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestPermission,
    toggleNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Helper functions
function getUpdateTitle(updateType) {
  switch (updateType) {
    case 'tp_hit':
      return '✅ Take Profit Hit!';
    case 'breakeven':
      return '🔒 Moved to Breakeven';
    case 'closed':
      return '🏁 Signal Closed';
    default:
      return '📊 Signal Updated';
  }
}

function getUpdateMessage(updateType) {
  switch (updateType) {
    case 'tp_hit':
      return 'TP level reached';
    case 'breakeven':
      return 'Stop loss moved to breakeven';
    case 'closed':
      return 'Signal has been closed';
    default:
      return 'Signal has been updated';
  }
}

function getUpdateIcon(updateType) {
  switch (updateType) {
    case 'tp_hit':
      return '✅';
    case 'breakeven':
      return '🔒';
    case 'closed':
      return '🏁';
    default:
      return '📊';
  }
}
