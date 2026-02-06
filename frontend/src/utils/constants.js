// Get API URL from environment variable, fallback to localhost for development
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If environment variable is set, use it
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // Production: require environment variable
  console.error('❌ ERROR: VITE_API_URL environment variable is not set!');
  console.error('Please set VITE_API_URL in Vercel environment variables.');
  console.error('Format: https://your-backend.railway.app/api');
  
  // Return empty string to prevent connection attempts
  return '';
};

export const API_URL = getApiUrl();

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


