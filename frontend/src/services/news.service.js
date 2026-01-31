import api from './api';

export const newsService = {
  async getNews(query = '') {
    const params = query ? { q: query } : {};
    const { data } = await api.get('/news', { params });
    return data;
  },
};