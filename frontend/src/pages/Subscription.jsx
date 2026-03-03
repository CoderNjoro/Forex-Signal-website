import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown, Zap, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import settingsService from '../services/settings.service';
import toast from 'react-hot-toast';

const Subscription = () => {
  const navigate = useNavigate();
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
        toast.error('Could not load latest pricing');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[130px] rounded-full opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
            <Zap size={14} className="fill-indigo-400" />
            Pricing Plans
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-none">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Trading Future</span>
          </h2>
          <p className="max-w-2xl mx-auto text-indigo-200/40 text-xl font-medium pt-2">
            Professional-grade signals for serious traders who demand excellence and precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Standard Plan */}
          <div className="group relative">
            <div className="absolute inset-0 bg-white/[0.02] rounded-[3rem] border border-white/10 transition-colors group-hover:bg-white/[0.04]" />
            <div className="relative p-12 h-full flex flex-col">
              <div className="mb-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                  <Shield size={24} className="text-white/40" />
                </div>
                <h3 className="text-white/40 font-black uppercase tracking-[0.2em] text-xs mb-4">Standard</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">$0</span>
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest">/ Forever</span>
                </div>
              </div>
              
              <ul className="space-y-6 mb-12 flex-1">
                <li className="flex items-start gap-4 text-white/60">
                  <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-sm font-medium">Basic Currency Signals</span>
                </li>
                <li className="flex items-start gap-4 text-white/60">
                  <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Check size={12} />
                  </div>
                  <span className="text-sm font-medium text-white/40 italic">Delayed Notifications (15m+)</span>
                </li>
                <li className="flex items-start gap-4 text-white/20 line-through">
                  <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <X size={12} />
                  </div>
                  <span className="text-sm font-medium">Institutional Market Depth</span>
                </li>
              </ul>

              <button disabled className="w-full py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/20 font-black uppercase tracking-widest text-sm cursor-not-allowed">
                Already Active
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="group relative">
            {/* Massive Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[3.1rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700 animate-pulse" />
            
            <div className="relative p-12 h-full flex flex-col bg-[#0A0C10]/90 backdrop-blur-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
              {/* Corner Badge */}
              <div className="absolute top-0 right-0 p-8 pt-10">
                <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 rotate-12 group-hover:rotate-0 transition-transform">
                  Best Value
                </div>
              </div>

              <div className="mb-10">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Crown size={24} className="fill-indigo-500" />
                </div>
                <h3 className="text-indigo-400 font-extrabold uppercase tracking-[0.3em] text-xs mb-4">Professional</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {loading ? "..." : `$${subscriptionPrice.usd}`}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-indigo-300/40 font-black uppercase text-[10px] tracking-widest transition-colors group-hover:text-indigo-400">/ One-time</span>
                    <span className="text-white/20 text-[8px] font-bold uppercase">Lifetime Access</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-6 mb-12 flex-1">
                {[
                  "Instant Institutional Alerts",
                  "Advanced SL/TP Calculations",
                  "Deep Market Technicals",
                  "Exclusive Member Insights",
                  "Dedicated Support Concierge"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-white group-hover:translate-x-1 transition-transform">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
                Upgrade to Premium
                <TrendingUp size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale transition-all hover:opacity-50 hover:grayscale-0">
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-white">
             <Shield size={20} /> Encrypted
           </div>
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-white">
             <CheckCircle2 size={20} /> Verified
           </div>
           <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-white">
             <Zap size={20} /> Instant
           </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
