import React, { useEffect, useState } from 'react';
import { forumService } from '../services/forum.service';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Plus, Pin, Lock, Unlock, MessageSquare, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { key: 'geopolitics', label: 'Geopolitics' },
  { key: 'monetary_policy', label: 'Monetary Policy' },
  { key: 'trade', label: 'Trade & Tariffs' },
  { key: 'energy', label: 'Energy & Commodities' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'macro', label: 'Macro Indicators' },
];

const Discussions = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [category, setCategory] = useState('geopolitics');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const canModerate = isAdmin || isSuperAdmin;

  useEffect(() => {
    loadTopics(category);
  }, [category]);

  const loadTopics = async (cat) => {
    try {
      setLoading(true);
      const { items } = await forumService.listTopics({ category: cat });
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
      const { item } = await forumService.createTopic({ ...form, category });
      setTopics([item, ...topics]);
      setShowModal(false);
      setForm({ title: '', content: '' });
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter size={22} className="text-indigo-600" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            {CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
        >
          <Plus size={18} /> New Topic
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((t) => (
            <div key={t._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    {t.pinned && <Pin size={16} className="text-amber-600" />}
                    <Link to={`/forum/${t._id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600">
                      {t.title}
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-4 whitespace-pre-wrap">{t.content}</p>
                  <Link 
                    to={`/forum/${t._id}`}
                    className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Read full discussion <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    By <span className="font-bold">{t.author?.username}</span> • Replies {t.replyCount} {t.locked && '• Locked'}
                  </div>
                </div>
                {canModerate && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePin(t._id)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl">{t.pinned ? 'Unpin' : 'Pin'}</button>
                    <button onClick={() => toggleLock(t._id)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl">{t.locked ? 'Unlock' : 'Lock'}</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {topics.length === 0 && (
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300">No topics yet. Be the first to start a discussion.</p>
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
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <textarea
                rows={8}
                placeholder="Share your insights..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
              />
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;