import React, { useState, useEffect } from 'react';
import { promotionService } from '../../services/promotion.service';
import { formatDate } from '../../utils/helpers';
import { API_URL } from '../../utils/constants';
import Loader from '../common/Loader';
import { Gift, Calendar, ExternalLink, ChevronRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const data = await promotionService.getPromotions();
      setPromotions(data);
    } catch (error) {
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-6 tracking-wider">
            <Gift size={14} /> EXCLUSIVE OFFERS
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Lucky Draw & Promotions</h1>
          <p className="text-white/80 text-lg font-medium">Get rewarded for your trading journey. Check out our active lucky draws and exclusive member promotions below.</p>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>
      </div>

      {promotions.length === 0 ? (
        <div className="card text-center py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Promotions</h2>
          <p className="text-gray-500 max-w-sm mx-auto">We don't have any active promotions at the moment. Please check back later or subscribe to our notifications!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div 
              key={promo._id} 
              className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer"
              onClick={() => setSelectedPromo(promo)}
            >
              {promo.image ? (
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={`${API_URL.replace('/api', '')}/${promo.image}`} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold">LIMITED TIME</span>
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center relative">
                  <Gift size={48} className="text-indigo-200 dark:text-indigo-800" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold">LIMITED TIME</span>
                  </div>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">{promo.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">{promo.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-indigo-500" />
                    Ends {formatDate(promo.endDate)}
                  </div>
                  <button className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                    Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promotion Detail Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedPromo(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full transition-all active:scale-95"
            >
              <ExternalLink size={20} className="rotate-45" />
            </button>

            {selectedPromo.image && (
              <div className="h-64 sm:h-80 w-full">
                <img src={`${API_URL.replace('/api', '')}/${selectedPromo.image}`} alt={selectedPromo.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-8 sm:p-12">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs mb-4 tracking-widest uppercase">
                <Gift size={16} /> Current Promotion
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{selectedPromo.title}</h2>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit text-sm font-bold text-gray-600 dark:text-gray-300 mb-8">
                <Calendar size={18} className="text-indigo-500" /> 
                Valid until {formatDate(selectedPromo.endDate)}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-4">Terms & Details</h4>
                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                  {selectedPromo.content}
                </div>
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                <p className="text-indigo-700 dark:text-indigo-300 font-bold mb-4 text-center">Ready to participate?</p>
                <button 
                  onClick={() => { setSelectedPromo(null); toast.success("Good luck! You're in!"); }}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  OPT-IN NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
