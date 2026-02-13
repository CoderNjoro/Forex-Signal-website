import api from './api';

const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

const updateSubscriptionPrice = async (usd, kes) => {
  const response = await api.put('/superadmin/settings/subscription-price', { usd, kes });
  return response.data;
};

const updateCryptoSettings = async (cryptoData) => {
  const response = await api.put('/superadmin/settings/crypto', cryptoData);
  return response.data;
};

const settingsService = {
  getSettings,
  updateSubscriptionPrice,
  updateCryptoSettings,
};

export default settingsService;
