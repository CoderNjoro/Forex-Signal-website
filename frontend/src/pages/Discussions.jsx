import React, { useEffect, useState } from 'react';
import { forumService } from '../services/forum.service';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Plus, Pin, Lock, Unlock, MessageSquare, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { key: 'all', label: 'All Categories' },
  { key: 'geopolitics', label: 'Geopolitics' },
  { key: 'monetary_policy', label: 'Monetary Policy' },
  { key: 'trade', label: 'Trade & Tariffs' },
  { key: 'energy', label: 'Energy & Commodities' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'macro', label: 'Macro Indicators' },
];

const Discussions = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [category, setCategory] = useState('all');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'geopolitics' });

  const canModerate = isAdmin || isSuperAdmin;

  useEffect(() => {
    loadTopics(category);
  }, [category]);

  const loadTopics = async (cat) => {
    try {
      setLoading(true);
      const params = cat === 'all' ? {} : { category: cat };
      const { items } = await forumService.listTopics(params);
      setTopics(items || []);
    } catch (err) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const submitTopic = async (e) => {
    e.preventDefault();
    try {
      if (!form.title.trim() || !form.content.trim()) {
        return toast.error('Title and content are required');
      }
      const { item } = await forumService.createTopic(form);
      if (category === 'all' || category === form.category) {
        setTopics([item, ...topics]);
      }
      setShowModal(false);
      setForm({ title: '', content: '', category: 'geopolitics' });
      toast.success('Topic created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create topic');
    }
  };

  const togglePin = async (topicId) => {
    try {
      const { item } = await forumService.togglePin(topicId);
      setTopics(topics.map(t => t._id === topicId ? item : t));
      toast.success(item.pinned ? 'Pinned' : 'Unpinned');
    } catch (err) {
      toast.error('Failed to toggle pin');
    }
  };

  const toggleLock = async (topicId) => {
    try {
      const { item } = await forumService.toggleLock(topicId);
      setTopics(topics.map(t => t._id === topicId ? item : t));
      toast.success(item.locked ? 'Locked' : 'Unlocked');
    } catch (err) {
      toast.error('Failed to toggle lock');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                category === c.key 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-indigo-500/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={18} /> New Topic
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((t) => (
            <div key={t._id} className="group bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all hover:shadow-xl hover:border-indigo-500/20">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-500/10">
                      {CATEGORIES.find(c => c.key === t.category)?.label || t.category}
                    </span>
                    {t.pinned && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-500/10">
                        <Pin size={10} /> Pinned
                      </div>
                    )}
                  </div>

                  <div>
                    <Link to={`/forum/${t._id}`} className="text-2xl font-black text-gray-900 dark:text-white hover:text-indigo-600 transition-colors tracking-tight">
                      {t.title}
                    </Link>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed font-medium">
                      {t.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {t.author?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{t.author?.username}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MessageSquare size={14} />
                      <span className="text-xs font-medium">{t.replyCount} replies</span>
                    </div>
                    {t.locked && (
                      <div className="flex items-center gap-1.5 text-red-400">
                        <Lock size={14} />
                        <span className="text-xs font-medium uppercase tracking-widest">Locked</span>
                      </div>
                    )}
                  </div>
                </div>

                {canModerate && (
                  <div className="flex items-center gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => togglePin(t._id)} 
                      className={`p-2 rounded-xl transition-all ${t.pinned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
                      title={t.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin size={18} />
                    </button>
                    <button 
                      onClick={() => toggleLock(t._id)} 
                      className={`p-2 rounded-xl transition-all ${t.locked ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}
                      title={t.locked ? 'Unlock' : 'Lock'}
                    >
                      {t.locked ? <Unlock size={18} /> : <Lock size={18} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {topics.length === 0 && (
            <div className="py-20 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Discussions Found</p>
            </div>
          )}
        </div>
      )}

      {/* Create Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full max-w-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Topic</h3>
            <form onSubmit={submitTopic} className="space-y-4">
              <input
                type="text"
                placeholder="Topic Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 font-bold"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                {CATEGORIES.filter(c => c.key !== 'all').map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <textarea
                rows={8}
                placeholder="Share your insights..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Create Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;