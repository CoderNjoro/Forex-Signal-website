import api from './api';

export const forumService = {
  async listTopics(params = {}) {
    const { data } = await api.get('/forum/topics', { params });
    return data;
  },
  async createTopic(payload) {
    const { data } = await api.post('/forum/topics', payload);
    return data;
  },
  async getTopic(id) {
    const { data } = await api.get(`/forum/topics/${id}`);
    return data;
  },
  async addReply(id, payload) {
    const { data } = await api.post(`/forum/topics/${id}/replies`, payload);
    return data;
  },
  async togglePin(id) {
    const { data } = await api.patch(`/forum/topics/${id}/pin`);
    return data;
  },
  async toggleLock(id) {
    const { data } = await api.patch(`/forum/topics/${id}/lock`);
    return data;
  },
  async deleteTopic(id) {
    const { data } = await api.delete(`/forum/topics/${id}`);
    return data;
  },
  async deleteReply(id, replyId) {
    const { data } = await api.delete(`/forum/topics/${id}/replies/${replyId}`);
    return data;
  },
};