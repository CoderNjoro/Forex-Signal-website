import React, { useState, useEffect } from 'react';
import { promotionService } from '../../services/promotion.service';
import { formatDate } from '../../utils/helpers';
import { API_URL } from '../../utils/constants';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, XCircle, Image as ImageIcon, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ManagePromotions = () => {
  const { user, isSuperAdmin } = useAuth();
  const canCreate = isSuperAdmin || user?.canCreatePromotions;
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [showOptInsModal, setShowOptInsModal] = useState(false);
  const [currentPromoTitle, setCurrentPromoTitle] = useState('');
  const [loadingOptIns, setLoadingOptIns] = useState(false);
  const [optInsList, setOptInsList] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    endDate: '',
    isActive: true,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await promotionService.getAllPromotionsAdmin();
      setPromotions(data);
    } catch (error) {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      endDate: '',
      isActive: true,
    });
    setImage(null);
    setPreviewUrl(null);
    setEditingPromo(null);
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description,
      content: promo.content,
      endDate: new Date(promo.endDate).toISOString().split('T')[0],
      isActive: promo.isActive,
    });
    setPreviewUrl(promo.image ? `${API_URL.replace('/api', '')}/${promo.image}` : null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await promotionService.deletePromotion(id);
      toast.success('Promotion deleted');
      loadPromotions();
    } catch (error) {
      toast.error('Failed to delete promotion');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      if (editingPromo) {
        await promotionService.updatePromotion(editingPromo._id, data);
        toast.success('Promotion updated');
      } else {
        await promotionService.createPromotion(data);
        toast.success('Promotion created');
      }
      setShowModal(false);
      resetForm();
      loadPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleViewOptIns = async (promo) => {
    setCurrentPromoTitle(promo.title);
    setShowOptInsModal(true);
    setLoadingOptIns(true);
    try {
      const data = await promotionService.getOptIns(promo._id);
      setOptInsList(data);
    } catch (error) {
      toast.error('Failed to load opt-ins');
    } finally {
      setLoadingOptIns(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions & Offers</h2>
          <p className="text-gray-500 text-sm">Create and manage dynamic offers for users</p>
        </div>
        {canCreate ? (
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm"
          >
            <Plus size={18} />
            Create Promotion
          </button>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold">
            SuperAdmin must grant promotion creation permission
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader /></div>
      ) : promotions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No promotions created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div key={promo._id} className="card group hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{promo.title}</h3>
                    {promo.isActive ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                        <CheckCircle size={10} /> ACTIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                        <XCircle size={10} /> INACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{promo.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(promo)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(promo._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-[11px] font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500" />
                  <span>Ends: {formatDate(promo.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} className="text-indigo-500" />
                  <span>{promo.image ? 'Image Included' : 'No Image'}</span>
                </div>
              </div>

              {promo.image && (
                <div className="w-full h-32 rounded-xl overflow-hidden mb-4 border border-gray-100 dark:border-gray-700">
                  <img src={`${API_URL.replace('/api', '')}/${promo.image}`} alt={promo.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => handleViewOptIns(promo)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all font-bold text-sm"
                >
                  <Users size={16} />
                  View Opt-ins
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promotion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
            <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingPromo ? 'Edit Promotion' : 'New Promotion'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 p-2"><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label text-sm">Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Lucky 10 Draw"
                />
              </div>

              <div>
                <label className="label text-sm">Short Description</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Get a chance to win 10 dollars instantly"
                />
              </div>

              <div>
                <label className="label text-sm">Full Content/Terms</label>
                <textarea
                  required
                  rows="4"
                  className="input"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed terms and conditions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm">End Date</label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4 pt-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label text-sm">Promo Image</label>
                <div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-indigo-500 cursor-pointer transition-all"
                  onClick={() => document.getElementById('promo-image').click()}
                >
                  <input id="promo-image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <p className="text-xs">Click to upload promotion banner</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-600/20"
                >
                  {editingPromo ? 'Save Changes' : 'Publish Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Opt-ins Modal */}
      {showOptInsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
            <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Promotion Opt-ins</h3>
                <p className="text-sm text-gray-500">{currentPromoTitle}</p>
              </div>
              <button onClick={() => setShowOptInsModal(false)} className="text-gray-500 hover:text-gray-700 p-2"><XCircle size={24} /></button>
            </div>
            
            <div className="p-6">
              {loadingOptIns ? (
                <div className="flex justify-center py-12"><Loader /></div>
              ) : optInsList.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No users have opted in yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    <span>User</span>
                    <span>Opt-in Date</span>
                  </div>
                  {optInsList.map((optIn) => (
                    <div key={optIn._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{optIn.user.username}</div>
                        <div className="text-sm text-gray-500">{optIn.user.email}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {new Date(optIn.optInDate).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-right text-sm text-gray-500">
                    Total Participants: <span className="font-bold text-indigo-600">{optInsList.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePromotions;
