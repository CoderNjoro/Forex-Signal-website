import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forumService } from '../services/forum.service';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Topic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');

  const canModerate = isAdmin || isSuperAdmin;

  useEffect(() => {
    loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      setLoading(true);
      const { item, replies } = await forumService.getTopic(id);
      setTopic(item);
      setReplies(replies || []);
    } catch (err) {
      toast.error('Topic not found');
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    try {
      if (!reply.trim()) return toast.error('Reply text is required');
      const { item } = await forumService.addReply(id, { content: reply });
      setReplies([...replies, item]);
      setReply('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add reply');
    }
  };

  const deleteTopic = async () => {
    try {
      await forumService.deleteTopic(id);
      toast.success('Topic deleted');
      navigate('/forum');
    } catch (err) {
      toast.error('Failed to delete topic');
    }
  };

  const deleteReply = async (replyId) => {
    try {
      await forumService.deleteReply(id, replyId);
      setReplies(replies.filter(r => r._id !== replyId));
    } catch (err) {
      toast.error('Failed to delete reply');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-12 space-y-8">
      {topic && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white break-words">{topic.title}</h1>
              <div className="mt-4 prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words text-lg leading-relaxed">{topic.content}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">By <span className="font-bold">{topic.author?.username}</span> • Replies {topic.replyCount} {topic.locked && '• Locked'}</div>
            </div>
            {(canModerate || topic.author?._id === user?._id) && (
              <button onClick={deleteTopic} className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl">Delete</button>
            )}
          </div>
        </div>
      )}

      {/* Replies */}
      <div className="space-y-4">
        {replies.map((r) => (
          <div key={r._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{r.author?.username}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              {(canModerate || r.author?._id === user?._id) && (
                <button onClick={() => deleteReply(r._id)} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl">Delete</button>
              )}
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{r.content}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {!topic?.locked && (
        <form onSubmit={submitReply} className="space-y-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <textarea
            rows={4}
            placeholder="Write a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Reply</button>
          </div>
        </form>
      )}
      {topic?.locked && (
        <div className="p-4 text-center text-gray-600 dark:text-gray-300">This topic is locked. No new replies allowed.</div>
      )}
    </div>
  );
};

export default Topic;