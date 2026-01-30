import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/helpers';

const SignalUpdateModal = ({ signal, onClose }) => {
  const [updating, setUpdating] = useState(false);
  const [tpHits, setTpHits] = useState(signal.tpHits || new Array(signal.takeProfit.length).fill(false));
  const [customClose, setCustomClose] = useState({
    closingPrice: '',
    result: 'win',
    pips: '',
  });
  const [accessPlan, setAccessPlan] = useState(signal.accessPlan || 'free');

  const handleTPToggle = async (index) => {
    const newTpHits = [...tpHits];
    newTpHits[index] = !newTpHits[index];
    setTpHits(newTpHits);

    setUpdating(true);
    try {
      await api.put(`/signals/${signal._id}/tp-hit`, {
        tpIndex: index,
        isHit: newTpHits[index],
      });
      toast.success(`TP${index + 1} ${newTpHits[index] ? 'marked as hit' : 'unmarked'}`);
    } catch (error) {
      toast.error('Failed to update TP status');
      // Revert on error
      newTpHits[index] = !newTpHits[index];
      setTpHits(newTpHits);
    } finally {
      setUpdating(false);
    }
  };

  const handleSLHit = async () => {
    if (!window.confirm('Mark this signal as Stop Loss hit? This will close the signal.')) {
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/signals/${signal._id}/sl-hit`, {});
      toast.success('Signal marked as SL hit');
      onClose();
    } catch (error) {
      toast.error('Failed to mark SL hit');
    } finally {
      setUpdating(false);
    }
  };

  const handleBreakeven = async () => {
    if (!window.confirm('Mark this signal as Breakeven? This will close the signal.')) {
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/signals/${signal._id}/breakeven`, {
        breakEvenPrice: signal.entryPrice,
      });
      toast.success('Signal marked as Breakeven');
      onClose();
    } catch (error) {
      toast.error('Failed to mark breakeven');
    } finally {
      setUpdating(false);
    }
  };

  const handleCustomClose = async (e) => {
    e.preventDefault();
    
    if (!customClose.closingPrice || !customClose.pips) {
      toast.error('Please fill in all fields');
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/signals/${signal._id}/close`, {
        closingPrice: parseFloat(customClose.closingPrice),
        result: customClose.result,
        pips: parseFloat(customClose.pips),
      });
      toast.success('Signal closed successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to close signal');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Update Signal Status</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">{signal.pair} - {signal.type.toUpperCase()}</p>
                <div className="flex gap-1 p-0.5 bg-gray-100 rounded-lg">
                  <button
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await api.put(`/signals/${signal._id}`, { accessPlan: 'free' });
                        setAccessPlan('free');
                        toast.success('Signal set to FREE');
                      } catch (e) { toast.error('Failed to update plan'); }
                      finally { setUpdating(false); }
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      accessPlan === 'free' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    FREE
                  </button>
                  <button
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await api.put(`/signals/${signal._id}`, { accessPlan: 'premium' });
                        setAccessPlan('premium');
                        toast.success('Signal set to PREMIUM');
                      } catch (e) { toast.error('Failed to update plan'); }
                      finally { setUpdating(false); }
                    }}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      accessPlan === 'premium' ? 'bg-indigo-600 text-white' : 'text-gray-400'
                    }`}
                  >
                    PREMIUM
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={updating}
            >
              ×
            </button>
          </div>

          {/* Signal Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Entry Price</p>
                <p className="font-semibold">{formatPrice(signal.entryPrice)}</p>
              </div>
              <div>
                <p className="text-gray-600">Stop Loss</p>
                <p className="font-semibold text-red-600">{formatPrice(signal.stopLoss)}</p>
              </div>
            </div>
          </div>

          {/* TP Levels */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Take Profit Levels</h3>
            <div className="space-y-2">
              {signal.takeProfit.map((tp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-700">TP{index + 1}:</span>
                    <span className="font-semibold text-green-600">{formatPrice(tp)}</span>
                  </div>
                  <button
                    onClick={() => handleTPToggle(index)}
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      tpHits[index]
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } disabled:opacity-50`}
                  >
                    {tpHits[index] ? '✓ Hit' : 'Mark as Hit'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSLHit}
                disabled={updating}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Mark SL Hit
              </button>
              <button
                onClick={handleBreakeven}
                disabled={updating}
                className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50"
              >
                Mark Breakeven
              </button>
            </div>
          </div>

          {/* Custom Close */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Custom Close</h3>
            <form onSubmit={handleCustomClose} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Price
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={customClose.closingPrice}
                  onChange={(e) => setCustomClose({ ...customClose, closingPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter closing price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Result
                </label>
                <select
                  value={customClose.result}
                  onChange={(e) => setCustomClose({ ...customClose, result: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="breakeven">Breakeven</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pips
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customClose.pips}
                  onChange={(e) => setCustomClose({ ...customClose, pips: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter pips (positive or negative)"
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Close Signal'}
              </button>
            </form>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              disabled={updating}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalUpdateModal;
