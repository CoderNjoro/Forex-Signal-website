import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/comment.service';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { useNotifications } from '../../context/NotificationContext';

const CommentsSection = ({ signalId }) => {
  const { user, isAdmin } = useAuth();
  const { socket } = useNotifications();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signalId) {
      loadComments();
    }
  }, [signalId]);

  useEffect(() => {
    if (socket) {
      const handleNewComment = (data) => {
        if (data.signalId === signalId) {
          setComments((prev) => {
            // Check if comment already exists (e.g. from the person who posted)
            if (prev.find(c => c._id === data.comment._id)) return prev;
            return [data.comment, ...prev];
          });
        }
      };

      const handleDeletedComment = (data) => {
        if (data.signalId === signalId) {
          setComments((prev) => prev.filter(c => c._id !== data.commentId));
        }
      };

      socket.on('comment:new', handleNewComment);
      socket.on('comment:deleted', handleDeletedComment);

      return () => {
        socket.off('comment:new', handleNewComment);
        socket.off('comment:deleted', handleDeletedComment);
      };
    }
  }, [socket, signalId]);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(signalId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const comment = await commentService.addComment({
        content: newComment,
        signalId,
      });
      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Failed to add comment', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Discussion ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-750 p-4 rounded-lg text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please log in to join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold text-sm border border-primary-200 dark:border-primary-800">
                  {comment.userId?.username?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.userId?.username || 'Unknown User'}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
                  {comment.content}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  title="Delete comment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to start the discussion!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
