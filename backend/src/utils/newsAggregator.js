const RSSParser = require('rss-parser');
const axios = require('axios');

const parser = new RSSParser();

// In-memory cache: { key: { timestamp, data } }
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Curated RSS feeds focused on geopolitics/economics affecting FX
const FEEDS = [
  { name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews' },
  { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews' },
  { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
  { name: 'The Guardian World', url: 'https://www.theguardian.com/world/rss' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'Politico', url: 'https://www.politico.com/rss/politics-news.xml' },
];

function normalizeItem(item, sourceName) {
  return {
    title: item.title || '',
    summary: item.contentSnippet || item.content || '',
    link: item.link || item.guid || '',
    source: sourceName,
    publishedAt: item.isoDate || item.pubDate || null,
    categories: item.categories || [],
  };
}

function matchQuery(article, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const hay = `${article.title} ${article.summary} ${article.source}`.toLowerCase();
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every(term => hay.includes(term));
}

async function fetchFeed(feed) {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items || []).map(item => normalizeItem(item, feed.name));
  } catch (err) {
    return [];
  }
}

async function fetchNews(query) {
  const key = `news:${query || ''}`;
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const results = await Promise.all(FEEDS.map(feed => fetchFeed(feed)));
  const flat = results.flat();
  const filtered = flat.filter(a => matchQuery(a, query));

  // Sort by publishedAt desc
  filtered.sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return tb - ta;
  });

  cache.set(key, { timestamp: now, data: filtered });
  return filtered;
}

module.exports = {
  fetchNews,
};