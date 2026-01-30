import React, { useState, useEffect } from 'react';
import { signalService } from '../../services/signal.service';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import { formatDate, formatPrice, getStatusColor, getResultColor, getTypeColor } from '../../utils/helpers';
import SignalUpdateModal from './SignalUpdateModal';

const ManageSignals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadSignals();
  }, [filter]);

  const loadSignals = async () => {
    setLoading(true);
    try {
      const data = await signalService.getSignals({ status: filter, limit: 50 });
      setSignals(data.signals || []);
    } catch (error) {
      toast.error('Failed to load signals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSignal = (signal) => {
    setSelectedSignal(signal);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSignal(null);
    loadSignals();
  };

  const handleDeleteSignal = async (signalId) => {
    if (!window.confirm('Are you sure you want to delete this signal?')) {
      return;
    }

    try {
      await signalService.deleteSignal(signalId);
      toast.success('Signal deleted successfully');
      loadSignals();
    } catch (error) {
      toast.error('Failed to delete signal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Signals</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'closed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Closed
          </button>
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : signals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No signals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {signals.map((signal) => (
            <div key={signal._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{signal.pair}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(signal.type)}`}>
                      {signal.type.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </span>
                    {signal.isBreakeven && (
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                        Breakeven
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      signal.accessPlan === 'premium' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {signal.accessPlan === 'premium' ? 'PREMIUM' : 'FREE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <p>Created: {formatDate(signal.createdAt)}</p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">{signal.commentsCount || 0}</span>
                      <span>Comments</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {signal.status === 'active' && (
                    <button
                      onClick={() => handleUpdateSignal(signal)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Update Status
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSignal(signal._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Entry Price</p>
                  <p className="text-lg font-semibold">{formatPrice(signal.entryPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stop Loss</p>
                  <p className="text-lg font-semibold text-red-600">{formatPrice(signal.stopLoss)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Take Profit</p>
                  <div className="flex flex-wrap gap-2">
                    {signal.takeProfit.map((tp, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${
                          signal.tpHits && signal.tpHits[index] ? 'text-green-600 line-through' : 'text-green-600'
                        }`}>
                          {formatPrice(tp)}
                        </span>
                        {signal.tpHits && signal.tpHits[index] && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeframe</p>
                  <p className="text-sm font-medium">{signal.timeframe}</p>
                </div>
              </div>

              {signal.status === 'closed' && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Result</p>
                      <p className={`text-sm font-bold ${getResultColor(signal.result)}`}>
                        {signal.result.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pips</p>
                      <p className={`text-sm font-bold ${signal.pips > 0 ? 'text-green-600' : signal.pips < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {signal.pips > 0 ? '+' : ''}{signal.pips}
                      </p>
                    </div>
                    {signal.closingPrice && (
                      <div>
                        <p className="text-sm text-gray-600">Closing Price</p>
                        <p className="text-sm font-semibold">{formatPrice(signal.closingPrice)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && selectedSignal && (
        <SignalUpdateModal
          signal={selectedSignal}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ManageSignals;
