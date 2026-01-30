import React, { useEffect, useState } from 'react';
import { useSignals } from '../../context/SignalContext';
import SignalCard from '../signals/SignalCard';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/helpers';
import SignalStatistics from '../signals/SignalStatistics';

const UserDashboard = () => {
  const { activeSignals, fetchActiveSignals, loading } = useSignals();
  const [stats, setStats] = useState({
    totalActive: 0,
    recentSignals: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await fetchActiveSignals();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    setStats({
      totalActive: activeSignals.length,
      recentSignals: activeSignals.slice(0, 6),
    });
  }, [activeSignals]);

  if (loading && activeSignals.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your trading overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Active Signals</p>
          <p className="text-3xl font-bold text-primary-600">{stats.totalActive}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="text-lg font-semibold text-gray-800">
            {activeSignals.length > 0
              ? formatDate(activeSignals[0]?.createdAt)
              : 'No signals yet'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Performance Statistics</h2>
        <SignalStatistics />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Active Signals</h2>
        {activeSignals.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No active signals at the moment</p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new trading opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSignals.map((signal) => (
              <SignalCard key={signal._id} signal={signal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
