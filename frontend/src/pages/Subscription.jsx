import React, { useState, useEffect } from 'react';
import { Check, X, Star, Zap, Shield, Crown } from 'lucide-react';
import PaymentModal from '../components/common/PaymentModal';
import settingsService from '../services/settings.service';

const Subscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState({ usd: 10, kes: 1300 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings?.premiumSubscriptionPrice) {
          setSubscriptionPrice(settings.premiumSubscriptionPrice);
        }
      } catch (error) {
        console.error('Failed to fetch subscription price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Choose Your <span className="text-indigo-500">Edge</span>
          </h2>
          <p className="max-w-2xl mx-auto text-indigo-200/50 text-xl font-medium">
            Gain the professional advantage with real-time institutional-grade signals and deep market analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] border border-white/10" />
            <div className="relative p-10 h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">Standard</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-white/40 font-medium">/forever</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/70">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Check size={12} />
                  </div>
                  Basic Signals
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Check size={12} />
                  </div>
                  Delayed Alerts (15m+)
                </li>
                <li className="flex items-center gap-3 text-white/30">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <X size={12} />
                  </div>
                  Institutional Analysis
                </li>
              </ul>

              <button disabled className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-bold cursor-not-allowed">
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="group relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.6rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            
            <div className="relative p-10 h-full flex flex-col bg-gray-900 rounded-[2.5rem] border border-white/10 overflow-hidden">
              {/* Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-600/20">
                Most Popular
              </div>

              <div className="mb-8">
                <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Professional</h3>
                <div className="flex items-baseline gap-1">
                  {loading ? (
                    <span className="text-5xl font-black text-white">...</span>
                  ) : (
                    <span className="text-5xl font-black text-white">${subscriptionPrice.usd}</span>
                  )}
                  <span className="text-indigo-300/40 font-medium">/lifetime access</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Check size={12} className="text-white" />
                  </div>
                  Instant Institutional Signals
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Check size={12} className="text-white" />
                  </div>
                  Full Trade Parameters (SL/TP)
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Check size={12} className="text-white" />
                  </div>
                  Premium Risk Calculator
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Check size={12} className="text-white" />
                  </div>
                  24/7 Priority Support
                </li>
              </ul>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
              >
                Get Premium Access
                <Crown size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        plan={{ name: 'Professional', price: subscriptionPrice.usd, kesPrice: subscriptionPrice.kes }}
      />
    </div>
  );
};

export default Subscription;
