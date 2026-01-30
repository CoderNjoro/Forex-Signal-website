import api from './api';

export const signalService = {
  getSignals: async (params = {}) => {
    const response = await api.get('/signals', { params });
    return response.data;
  },

  getSignal: async (id) => {
    const response = await api.get(`/signals/${id}`);
    return response.data;
  },

  getActiveSignals: async () => {
    const response = await api.get('/signals/active');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/signals/stats');
    return response.data;
  },

  createSignal: async (signalData) => {
    // If signalData is FormData, we must let the browser set the Content-Type
    // so it includes the boundary. Setting it to undefined overrides the default 'application/json'
    const config = signalData instanceof FormData 
      ? { headers: { 'Content-Type': undefined } }
      : {};
      
    const response = await api.post('/signals', signalData, config);
    return response.data;
  },

  updateSignal: async (id, signalData) => {
    const response = await api.put(`/signals/${id}`, signalData);
    return response.data;
  },

  deleteSignal: async (id) => {
    const response = await api.delete(`/signals/${id}`);
    return response.data;
  },

  updateTPHit: async (id, tpIndex, isHit) => {
    const response = await api.put(`/signals/${id}/tp-hit`, { tpIndex, isHit });
    return response.data;
  },

  markSLHit: async (id, pips) => {
    const response = await api.put(`/signals/${id}/sl-hit`, { pips });
    return response.data;
  },

  markBreakeven: async (id, breakEvenPrice) => {
    const response = await api.put(`/signals/${id}/breakeven`, { breakEvenPrice });
    return response.data;
  },

  closeSignal: async (id, data) => {
    const response = await api.put(`/signals/${id}/close`, data);
    return response.data;
  },

  voteSignal: async (id, vote) => {
    const response = await api.put(`/signals/${id}/vote`, { vote });
    return response.data;
  },
};


