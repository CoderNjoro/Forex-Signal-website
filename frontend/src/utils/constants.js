export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api';

export const CURRENCY_PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'USD/CHF',
  'AUD/USD',
  'USD/CAD',
  'NZD/USD',
  'EUR/GBP',
  'EUR/JPY',
  'GBP/JPY',
  'AUD/JPY',
  'EUR/AUD',
  'EUR/CAD',
  'GBP/AUD',
  'GBP/CAD',
  'XAU/USD',
  'XAG/USD',
  'US30',
  'NASDAQ',
];

export const TIMEFRAMES = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'];

export const SIGNAL_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};

export const SIGNAL_RESULT = {
  WIN: 'win',
  LOSS: 'loss',
  BREAKEVEN: 'breakeven',
  PENDING: 'pending',
};


