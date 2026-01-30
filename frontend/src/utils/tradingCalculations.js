/**
 * Trading calculation utilities for position sizing and risk management
 */

// Pip values for different currency pairs (per standard lot)
const PIP_VALUES = {
  // Major pairs (USD quote)
  'EURUSD': 10,
  'GBPUSD': 10,
  'AUDUSD': 10,
  'NZDUSD': 10,
  
  // JPY pairs
  'USDJPY': 9.09,
  'EURJPY': 9.09,
  'GBPJPY': 9.09,
  
  // CHF pairs
  'USDCHF': 10,
  
  // Gold/Silver
  'XAUUSD': 10,
  'XAGUSD': 50,
  
  // Default
  'DEFAULT': 10
};

/**
 * Calculate the number of pips between two prices
 * @param {number} price1 - First price
 * @param {number} price2 - Second price
 * @param {string} pair - Currency pair
 * @returns {number} Number of pips
 */
export const calculatePips = (price1, price2, pair) => {
  const difference = Math.abs(price1 - price2);
  
  // JPY pairs have 2 decimal places, others have 4
  if (pair.includes('JPY')) {
    return difference * 100;
  }
  
  // Gold has 2 decimal places
  if (pair.includes('XAU') || pair.includes('XAG')) {
    return difference * 10;
  }
  
  return difference * 10000;
};

/**
 * Calculate position size based on risk parameters
 * @param {Object} params - Calculation parameters
 * @param {number} params.accountBalance - Account balance in USD
 * @param {number} params.riskPercentage - Risk percentage (e.g., 1 for 1%)
 * @param {number} params.entryPrice - Entry price
 * @param {number} params.stopLoss - Stop loss price
 * @param {string} params.pair - Currency pair
 * @returns {Object} Position size details
 */
export const calculatePositionSize = ({ accountBalance, riskPercentage, entryPrice, stopLoss, pair }) => {
  // Calculate risk amount in USD
  const riskAmount = (accountBalance * riskPercentage) / 100;
  
  // Calculate stop loss distance in pips
  const stopLossPips = calculatePips(entryPrice, stopLoss, pair);
  
  // Get pip value for the pair
  const pipValue = PIP_VALUES[pair.toUpperCase()] || PIP_VALUES.DEFAULT;
  
  // Calculate lot size
  // Formula: Risk Amount / (Stop Loss in Pips × Pip Value per Lot)
  const lotSize = riskAmount / (stopLossPips * pipValue);
  
  // Round to 2 decimal places
  const standardLots = Math.round(lotSize * 100) / 100;
  const miniLots = Math.round(lotSize * 10 * 100) / 100;
  const microLots = Math.round(lotSize * 100 * 100) / 100;
  
  return {
    riskAmount: Math.round(riskAmount * 100) / 100,
    stopLossPips: Math.round(stopLossPips * 10) / 10,
    standardLots,
    miniLots,
    microLots,
    recommendedLots: standardLots,
  };
};

/**
 * Calculate potential profit for take profit levels
 * @param {Object} params - Calculation parameters
 * @param {number} params.entryPrice - Entry price
 * @param {number[]} params.takeProfitLevels - Array of TP prices
 * @param {number} params.lotSize - Position size in lots
 * @param {string} params.pair - Currency pair
 * @param {string} params.type - Signal type (buy/sell)
 * @returns {Array} Array of profit calculations
 */
export const calculateTakeProfitPotential = ({ entryPrice, takeProfitLevels, lotSize, pair, type }) => {
  const pipValue = PIP_VALUES[pair.toUpperCase()] || PIP_VALUES.DEFAULT;
  
  return takeProfitLevels.map((tpPrice, index) => {
    const pips = calculatePips(entryPrice, tpPrice, pair);
    const profit = pips * pipValue * lotSize;
    
    return {
      level: index + 1,
      price: tpPrice,
      pips: Math.round(pips * 10) / 10,
      profit: Math.round(profit * 100) / 100,
    };
  });
};

/**
 * Calculate risk-reward ratio
 * @param {number} entryPrice - Entry price
 * @param {number} stopLoss - Stop loss price
 * @param {number} takeProfit - Take profit price
 * @param {string} pair - Currency pair
 * @returns {number} Risk-reward ratio
 */
export const calculateRiskRewardRatio = (entryPrice, stopLoss, takeProfit, pair) => {
  const riskPips = calculatePips(entryPrice, stopLoss, pair);
  const rewardPips = calculatePips(entryPrice, takeProfit, pair);
  
  return Math.round((rewardPips / riskPips) * 100) / 100;
};

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format lot size
 * @param {number} lots - Lot size
 * @returns {string} Formatted lot string
 */
export const formatLots = (lots) => {
  return lots.toFixed(2);
};
