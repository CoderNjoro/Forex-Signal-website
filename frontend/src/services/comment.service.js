import api from './api';

export const commentService = {
  getComments: async (signalId) => {
    const response = await api.get(`/comments/signal/${signalId}`);
    return response.data;
  },

  addComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
