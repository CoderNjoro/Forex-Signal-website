import api from './api';

export const promotionService = {
  // Get active promotions for users
  getPromotions: async () => {
    const response = await api.get('/promotions');
    return response.data;
  },

  // Admin: Get all promotions
  getAllPromotionsAdmin: async () => {
    const response = await api.get('/promotions/admin');
    return response.data;
  },

  // Admin: Create promotion
  createPromotion: async (promoData) => {
    const config = promoData instanceof FormData 
      ? { headers: { 'Content-Type': undefined } }
      : {};
    const response = await api.post('/promotions', promoData, config);
    return response.data;
  },

  // Admin: Update promotion
  updatePromotion: async (id, promoData) => {
    const config = promoData instanceof FormData 
      ? { headers: { 'Content-Type': undefined } }
      : {};
    const response = await api.put(`/promotions/${id}`, promoData, config);
    return response.data;
  },

  // Admin: Delete promotion
  deletePromotion: async (id) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  // User: Opt-in to promotion
  optIn: async (id) => {
    const response = await api.post(`/promotions/${id}/opt-in`);
    return response.data;
  },

  // Admin: Get opt-ins for a promotion
  getOptIns: async (id) => {
    const response = await api.get(`/promotions/${id}/opt-ins`);
    return response.data;
  },
};
