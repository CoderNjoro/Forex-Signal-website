import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { signalService } from '../../services/signal.service';
import { formatDate, formatPrice, getStatusColor, getResultColor, getTypeColor } from '../../utils/helpers';
import { API_URL } from '../../utils/constants';
import Loader from '../common/Loader';
import RiskCalculator from '../calculator/RiskCalculator';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { useSignals } from '../../context/SignalContext';
import { Shield } from 'lucide-react';
import CommentsSection from './CommentsSection';

import bullishIcon from '../../assets/bullish.png';
import bearishIcon from '../../assets/bearish.png';

const SignalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { voteSignal } = useSignals();
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Voting state
  const isBullish = signal?.sentiment?.bullish?.includes(user?._id);
  const isBearish = signal?.sentiment?.bearish?.includes(user?._id);

  // Frontend safety check: Determine if signal should be shown as locked
  const isUserPremium = user?.role === 'admin' || user?.role === 'superadmin' || user?.subscriptionType === 'premium';
  const shouldBeLocked = signal?.accessPlan === 'premium' && !isUserPremium && signal?.status === 'active';
  const isLocked = signal?.isLocked || shouldBeLocked;

  const handleVote = async (type) => {
    try {
      const updatedSignal = await voteSignal(signal._id, type);
      setSignal(updatedSignal);
      toast.success(`Voted ${type}`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };



  useEffect(() => {
    loadSignal();
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}/${path}`;
  };

  const loadSignal = async () => {
    try {
      const data = await signalService.getSignal(id);
      setSignal(data);
    } catch (error) {
      toast.error('Failed to load signal');
      navigate('/signals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  if (!signal) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/signals')}
        className="mb-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      >
        ← Back to Signals
      </button>

      <div className="card dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{signal.pair}</h1>
            <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getTypeColor(signal.type)}`}>
              {signal.type.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(signal.status)}`}>
              {signal.status}
            </span>
            {signal.isBreakeven && (
              <span className="px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                Breakeven
              </span>
            )}
          </div>
        </div>

        {isLocked ? (
          <div className="py-16 px-6 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-indigo-200 dark:border-indigo-800">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20 rotate-3">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Institutional Grade Content</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium">
              This signal's entry points, risk management parameters, and technical chart analysis are reserved for our Premium members.
            </p>
            <Link 
              to="/subscription" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              UPGRADE TO UNLOCK NOW
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entry Price</p>
                  <p className="text-2xl font-bold dark:text-white">
                    {formatPrice(signal.entryPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stop Loss</p>
                  <p className="text-xl font-semibold text-red-600">
                    {formatPrice(signal.stopLoss)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Take Profit Levels</p>
                  <div className="space-y-2">
                    {signal.takeProfit.map((tp, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className={`text-lg font-semibold ${
                          signal.tpHits && signal.tpHits[index]
                            ? 'text-green-600 line-through opacity-75'
                            : 'text-green-600'
                        }`}>
                          TP{index + 1}: {formatPrice(tp)}
                        </span>
                        {signal.tpHits && signal.tpHits[index] && (
                          <span className="text-green-600 font-bold">✓ Hit</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timeframe</p>
                  <p className="text-lg font-medium dark:text-white">{signal.timeframe}</p>
                </div>
              </div>
            </div>

            {signal.status === 'closed' && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold dark:text-white mb-3">Result</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Outcome</p>
                    <p className={`text-xl font-bold ${getResultColor(signal.result)}`}>
                      {signal.result.toUpperCase()}
                    </p>
                  </div>
                  {signal.pips !== 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pips</p>
                      <p className={`text-xl font-bold ${signal.pips > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {signal.pips > 0 ? '+' : ''}{signal.pips}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {signal.analysis && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold dark:text-white mb-2">Analysis</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{signal.analysis}</p>
              </div>
            )}

            {/* Risk Calculator - Only show for active and unlocked signals */}
            {signal.status === 'active' && (
              <RiskCalculator signal={signal} className="mb-6" />
            )}

            {signal.chartImage && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold dark:text-white mb-2">Chart Analysis</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img
                    src={getImageUrl(signal.chartImage)}
                    alt={`${signal.pair} Chart`}
                    className="w-full h-auto cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(getImageUrl(signal.chartImage), '_blank')}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="border-t dark:border-gray-700 pt-6 mt-6">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Market Sentiment</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleVote('bullish')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isBullish
                    ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600'
                }`}
              >
                <img src={bullishIcon} alt="Bullish" className="w-8 h-8 object-contain" />
                <span>Bullish</span>
                <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded text-sm ml-1">
                  {signal.sentiment?.bullish?.length || 0}
                </span>
              </button>
              <button
                onClick={() => handleVote('bearish')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isBearish
                    ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600'
                }`}
              >
                <img src={bearishIcon} alt="Bearish" className="w-8 h-8 object-contain" />
                <span>Bearish</span>
                <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded text-sm ml-1">
                  {signal.sentiment?.bearish?.length || 0}
                </span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p>Created: {formatDate(signal.createdAt)}</p>
            </div>
            {signal.closedAt && (
              <div>
                <p>Closed: {formatDate(signal.closedAt)}</p>
              </div>
            )}
            {signal.adminId && (
              <div>
                <p>Created by: {signal.adminId.username || 'Admin'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <CommentsSection signalId={signal._id} />
    </div>
  );
};

export default SignalDetails;


