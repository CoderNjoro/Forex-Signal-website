import api from './api';

const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

const updateSubscriptionPrice = async (usd, kes) => {
  const response = await api.put('/superadmin/settings/subscription-price', { usd, kes });
  return response.data;
};

const settingsService = {
  getSettings,
  updateSubscriptionPrice,
};

export default settingsService;
