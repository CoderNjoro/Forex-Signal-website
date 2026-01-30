import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pt-28 px-4 pb-12 transition-all duration-300">
      <h1 className="text-4xl font-black mb-8 tracking-tight">Profile Settings</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-lg font-semibold capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Subscription</p>
            <p className="text-lg font-semibold capitalize">{user.subscriptionType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-semibold">{formatDate(user.createdAt)}</p>
          </div>
              {isAdmin && (
            <div>
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="text-lg font-semibold">{formatDate(user.lastLogin)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="card space-y-4">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <p className="text-sm text-gray-600 mb-4">
            {isAdmin && user.email === 'admin@forex.com' 
              ? '⚠️ Please change your default password for security.'
              : 'Enter your current password and choose a new one.'}
          </p>

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password *
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="input"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn btn-primary"
          >
            {passwordLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;

