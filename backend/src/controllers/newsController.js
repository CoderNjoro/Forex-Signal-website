const { fetchNews } = require('../utils/newsAggregator');

// GET /api/news?q=tariffs+europe
async function getNews(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const data = await fetchNews(q);
    res.json({ ok: true, count: data.length, items: data });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch news' });
  }
}

module.exports = {
  getNews,
};