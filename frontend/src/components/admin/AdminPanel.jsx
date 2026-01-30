import React, { useState, useEffect } from 'react';
import CreateSignal from './CreateSignal';
import ManageSignals from './ManageSignals';
import ManagePromotions from './ManagePromotions';
import ActivityLog from './ActivityLog';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const { isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Signal
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Signals
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promotions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Promotions
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity Log
            </button>
          )}
        </nav>
      </div>

      <div>
        {activeTab === 'create' && <CreateSignal />}
        {activeTab === 'manage' && <ManageSignals />}
        {activeTab === 'promotions' && <ManagePromotions />}
        {activeTab === 'activity' && isSuperAdmin && <ActivityLog />}
        {activeTab === 'stats' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.totalUsers}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Total Signals</p>
                  <p className="text-3xl font-bold text-primary-600">{stats.totalSignals}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Active Signals</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeSignals}</p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Win Rate</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.winRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600">Total Pips</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalPips > 0 ? '+' : ''}{stats.totalPips}
                  </p>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-500">No statistics available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


