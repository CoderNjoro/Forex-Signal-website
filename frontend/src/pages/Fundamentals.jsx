import React, { useEffect, useState } from 'react';
import { newsService } from '../services/news.service';
import toast from 'react-hot-toast';
import { Search, Globe, ExternalLink } from 'lucide-react';

const defaultQuery = 'tariffs sanctions inflation rate hike europe china us oil gdp employment trade';

const Fundamentals = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadNews('');
  }, []);

  const loadNews = async (q) => {
    try {
      setLoading(true);
      const data = await newsService.getNews(q || defaultQuery);
      setItems(data.items || []);
    } catch (err) {
      toast.error('Failed to load fundamentals news');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    loadNews(query.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Globe size={28} className="text-indigo-600" />
            Fundamentals & Geopolitics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Curated headlines impacting forex markets</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search keywords (e.g., tariffs europe, sanctions, rate hike)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <article key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600">{item.source}</span>
                  {item.publishedAt && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.publishedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h2>
                {item.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{item.summary}</p>
                )}
                <div className="flex justify-end">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200"
                  >
                    Read Source <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-300">No results. Try broader keywords (e.g., tariffs, sanctions, inflation).</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Fundamentals;