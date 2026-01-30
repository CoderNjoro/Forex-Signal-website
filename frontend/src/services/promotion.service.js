import axios from 'axios';
import { API_URL } from '../utils/constants';

const PROMO_URL = `${API_URL}/promotions`;

export const promotionService = {
  // Get active promotions for users
  getPromotions: async () => {
    const response = await axios.get(PROMO_URL);
    return response.data;
  },

  // Admin: Get all promotions
  getAllPromotionsAdmin: async () => {
    const response = await axios.get(`${PROMO_URL}/admin`);
    return response.data;
  },

  // Admin: Create promotion
  createPromotion: async (promoData) => {
    const response = await axios.post(PROMO_URL, promoData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Update promotion
  updatePromotion: async (id, promoData) => {
    const response = await axios.put(`${PROMO_URL}/${id}`, promoData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Admin: Delete promotion
  deletePromotion: async (id) => {
    const response = await axios.delete(`${PROMO_URL}/${id}`);
    return response.data;
  },
};
