import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Shield, BarChart3, Zap, ArrowRight, LayoutDashboard, Search } from 'lucide-react';
import heroBg from '../assets/hero-bg.jpg';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            filter: 'brightness(0.4)'
          }}
        />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-900/40 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="max-w-3xl animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-sm font-bold mb-8 tracking-wide uppercase">
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              Empowering Traders Globally
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8">
              Precision <span className="text-indigo-400">Forex Signals</span> for the Modern Trader.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-medium">
              Join thousands of successful traders. Get institutional-grade analysis and real-time execution signals delivered straight to your dashboard.
            </p>
            
            <div className="flex flex-wrap gap-6 mt-8">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 group"
                  >
                    <LayoutDashboard size={22} />
                    Go to Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/signals" 
                    className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-lg font-bold rounded-2xl transition-all"
                  >
                    <Search size={22} />
                    View Live Signals
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-xl font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 group"
                  >
                    Get Started Free
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xl font-bold rounded-2xl transition-all"
                  >
                    Client Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent z-10" />
      </div>

      {/* Trust & Stats Bar */}
      <div className="relative z-20 -mt-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <StatMini label="Live Users" value="12.5k+" />
          <StatMini label="Win Rate" value="84%" />
          <StatMini label="Signals/Month" value="250+" />
          <StatMini label="Support" value="24/7" />
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-sm font-extrabold text-indigo-600 uppercase tracking-widest mb-4">Elite Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dominance.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<TrendingUp className="text-indigo-600" />} 
            title="Advanced Analytics" 
            desc="Deep market penetration insights using our proprietary AI algorithms and Fibonacci distributions." 
          />
          <FeatureCard 
            icon={<BarChart3 className="text-emerald-600" />} 
            title="Performance Metrics" 
            desc="Granular tracking of your trading journey. Monitor pips, drawdown, and risk-to-reward ratios in real-time." 
          />
          <FeatureCard 
            icon={<Shield className="text-blue-600" />} 
            title="Smart Risk Management" 
            desc="Dynamic stop-loss and take-profit levels calculated to preserve capital while maximizing gains." 
          />
        </div>
      </div>
    </div>
  );
};

const StatMini = ({ label, value }) => (
  <div className="text-center">
    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{value}</p>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 duration-300">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

export default Home;
