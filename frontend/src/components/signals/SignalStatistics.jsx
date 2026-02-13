import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { signalService } from '../../services/signal.service';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SignalStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await signalService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  if (!stats) return null;

  const { profitability = [], dominance = [], overall = {} } = stats;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Signals</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{overall.totalSignals || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Pips</h3>
          <p className={`text-3xl font-bold mt-2 ${overall.totalPips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {overall.totalPips > 0 ? '+' : ''}{overall.totalPips || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Win Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {overall.totalSignals ? Math.round((overall.winCount / overall.totalSignals) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Wins / Losses</h3>
          <div className="flex items-center gap-4 mt-2">
             <span className="text-2xl font-bold text-green-600">{overall.winCount || 0} W</span>
             <span className="text-2xl font-bold text-red-600">{overall.lossCount || 0} L</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profitability Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Profitability Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitability}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="_id" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  formatter={(value) => [`${value} Pips`, 'Profit']}
                />
                <Legend />
                <Bar dataKey="totalPips" name="Net Pips" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {profitability.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.totalPips >= 0 ? '#10B981' : '#EF4444'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Currency Dominance Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Currency Dominance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dominance}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                >
                  {dominance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const entry = props.payload;
                    return [
                      `${value} Signals`, 
                      `Currency: ${entry.name}`,
                      `Pips: ${entry.totalPips > 0 ? '+' : ''}${entry.totalPips}`
                    ];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalStatistics;
