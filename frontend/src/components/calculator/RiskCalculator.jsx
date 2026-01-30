import React, { useState, useEffect } from 'react';
import {
  calculatePositionSize,
  calculateTakeProfitPotential,
  calculateRiskRewardRatio,
  formatCurrency,
  formatLots,
} from '../../utils/tradingCalculations';

const RiskCalculator = ({ signal, className = '' }) => {
  const [accountBalance, setAccountBalance] = useState(() => {
    return parseFloat(localStorage.getItem('accountBalance')) || 10000;
  });
  const [riskPercentage, setRiskPercentage] = useState(() => {
    return parseFloat(localStorage.getItem('riskPercentage')) || 1;
  });
  const [calculation, setCalculation] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (signal && accountBalance && riskPercentage) {
      calculatePosition();
    }
  }, [signal, accountBalance, riskPercentage]);

  useEffect(() => {
    localStorage.setItem('accountBalance', accountBalance.toString());
    localStorage.setItem('riskPercentage', riskPercentage.toString());
  }, [accountBalance, riskPercentage]);

  const calculatePosition = () => {
    try {
      const positionSize = calculatePositionSize({
        accountBalance,
        riskPercentage,
        entryPrice: signal.entryPrice,
        stopLoss: signal.stopLoss,
        pair: signal.pair,
      });

      const takeProfitPotential = calculateTakeProfitPotential({
        entryPrice: signal.entryPrice,
        takeProfitLevels: signal.takeProfit,
        lotSize: positionSize.recommendedLots,
        pair: signal.pair,
        type: signal.type,
      });

      const riskRewardRatios = signal.takeProfit.map((tp) =>
        calculateRiskRewardRatio(signal.entryPrice, signal.stopLoss, tp, signal.pair)
      );

      setCalculation({
        ...positionSize,
        takeProfitPotential,
        riskRewardRatios,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  if (!signal) return null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-white">Risk Calculator</h3>
        </div>
        <svg
          className={`w-5 h-5 text-white transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Balance (USD)
              </label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="10000"
                min="0"
                step="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Percentage (%)
              </label>
              <input
                type="number"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="1"
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          {calculation && (
            <>
              {/* Risk Summary */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risk Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Risk Amount</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(calculation.riskAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Stop Loss Distance</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{calculation.stopLossPips} pips</p>
                  </div>
                </div>
              </div>

              {/* Position Size */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Recommended Position Size
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Standard Lots</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatLots(calculation.standardLots)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mini Lots</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatLots(calculation.miniLots)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Micro Lots</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatLots(calculation.microLots)}</p>
                  </div>
                </div>
              </div>

              {/* Take Profit Potential */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Profit Potential
                </h4>
                <div className="space-y-3">
                  {calculation.takeProfitPotential.map((tp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                          TP{tp.level}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{tp.price.toFixed(5)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tp.pips} pips</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(tp.profit)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">R:R {calculation.riskRewardRatios[index]}:1</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Risk Management Reminder</h5>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      Never risk more than 1-2% of your account on a single trade. Always use proper risk management and consider market conditions before entering a position.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
