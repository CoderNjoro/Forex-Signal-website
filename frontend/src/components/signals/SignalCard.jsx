import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice, getStatusColor, getResultColor, getTypeColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useSignals } from '../../context/SignalContext';
import toast from 'react-hot-toast';
import { Shield, MessageSquare } from 'lucide-react';
import bullishIcon from '../../assets/bullish.png';
import bearishIcon from '../../assets/bearish.png';

const SignalCard = ({ signal }) => {
  const { user } = useAuth();
  const { voteSignal } = useSignals();

  const isBullish = signal.sentiment?.bullish?.includes(user?._id) || false;
  const isBearish = signal.sentiment?.bearish?.includes(user?._id) || false;
  
  // Frontend safety check: Determine if signal should be shown as locked
  const isUserPremium = user?.role === 'admin' || user?.role === 'superadmin' || user?.subscriptionType === 'premium';
  const shouldBeLocked = signal.accessPlan === 'premium' && !isUserPremium && signal.status === 'active';
  const isLocked = signal.isLocked || shouldBeLocked;
  
  const handleVote = async (e, type) => {
    e.preventDefault(); // Prevent navigating to details
    e.stopPropagation();
    try {
      await voteSignal(signal._id, type);
      toast.success(`Voted ${type}`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };



  return (
    <div className="card hover:shadow-lg transition-shadow duration-200 relative overflow-hidden">
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-gray-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-900/50 max-w-[200px]">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
              <Shield className="text-white" size={24} />
            </div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white mb-2">PREMIUM SIGNAL</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 font-bold leading-tight">Subscribe to unlock entry, SL, TP and chart analysis.</p>
            <Link to="/subscription" className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black transition-all shadow-lg shadow-indigo-600/20">
              UPGRADE NOW
            </Link>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{signal.pair}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getTypeColor(signal.type)}`}>
            {signal.type?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(signal.status)}`}>
            {signal.status}
          </span>
          {signal.accessPlan === 'premium' ? (
            <span className="px-2 py-1 rounded bg-indigo-600 text-white text-[10px] font-black tracking-wider shadow-sm">
              PREMIUM
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-green-500 text-white text-[10px] font-black tracking-wider shadow-sm">
              FREE
            </span>
          )}
          {signal.isBreakeven && (
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
              Breakeven
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Entry Price</p>
          <p className={`text-lg font-semibold ${isLocked ? 'blur-[3px] select-none opacity-50' : ''}`}>
            {isLocked ? '1.24500' : formatPrice(signal.entryPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Stop Loss</p>
          <p className={`text-lg font-semibold text-red-600 ${isLocked ? 'blur-[3px] select-none opacity-50' : ''}`}>
            {isLocked ? '1.24000' : formatPrice(signal.stopLoss)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Take Profit</p>
          {isLocked ? (
            <div className="flex flex-wrap gap-1 blur-[3px] select-none opacity-50">
               <span className="text-sm font-semibold text-green-600">1.25500</span>
               <span className="text-sm font-semibold text-green-600">1.26000</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {signal.takeProfit.map((tp, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className={`text-sm font-semibold ${
                    signal.tpHits && signal.tpHits[index] 
                      ? 'text-green-600 line-through opacity-75' 
                      : 'text-green-600'
                  }`}>
                    {formatPrice(tp)}
                  </span>
                  {signal.tpHits && signal.tpHits[index] && (
                    <span className="text-xs text-green-600 font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">Timeframe</p>
          <p className="text-sm font-medium">{signal.timeframe}</p>
        </div>
      </div>

      {signal.status === 'closed' && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Result:</span>
            <span className={`text-sm font-bold ${getResultColor(signal.result)}`}>
              {signal.result.toUpperCase()}
            </span>
          </div>
          {signal.pips !== 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Pips:</span>
              <span className={`text-sm font-bold ${signal.pips > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {signal.pips > 0 ? '+' : ''}{signal.pips}
              </span>
            </div>
          )}
        </div>
      )}

      {signal.analysis && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{signal.analysis}</p>
      )}

      {/* Sentiment Voting */}
      <div className="flex items-center gap-4 mb-4 border-t pt-3 border-gray-100 dark:border-gray-700">
        <button
          onClick={(e) => handleVote(e, 'bullish')}
          className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
            isBullish 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <img src={bullishIcon} alt="Bullish" className="w-4 h-4 object-contain" />
          <span>Bullish</span>
          <span>{signal.sentiment?.bullish?.length || 0}</span>
        </button>
        <button
          onClick={(e) => handleVote(e, 'bearish')}
          className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
            isBearish 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          <img src={bearishIcon} alt="Bearish" className="w-4 h-4 object-contain" />
          <span>Bearish</span>
          <span>{signal.sentiment?.bearish?.length || 0}</span>
        </button>

        <div className="flex-1"></div>

        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <MessageSquare size={14} className="opacity-70" />
          <span className="text-xs font-semibold">{signal.commentsCount || 0}</span>
          <span className="text-[10px] opacity-70 uppercase tracking-tight">Comments</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Created: {formatDate(signal.createdAt)}</span>
        <Link
          to={`/signals/${signal._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default SignalCard;


