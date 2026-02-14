import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-[30%] right-[20%] w-[10%] h-[10%] bg-indigo-500/5 blur-[80px] rounded-full" />
      </div>
      
      {/* Network Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="group relative">
           {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          
          <div className="relative bg-[#0A0C10]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.8rem] shadow-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-2xl mb-6 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="text-indigo-500" size={32} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-3">
                Account <span className="text-indigo-500">Secure</span>
              </h2>
              <p className="text-indigo-200/40 text-sm font-medium tracking-wide">
                Authorized Access Only
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    Terminal ID / Email
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium"
                      placeholder="admin@forex.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em]">
                      Access Key
                    </label>
                  </div>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/20 hover:text-indigo-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <div className="w-4 h-4 rounded-md border border-white/10 bg-white/5 flex items-center justify-center group-hover/check:border-indigo-500/50 transition-colors">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-0 group-hover/check:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-200/40 uppercase tracking-widest">Keep Session</span>
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-indigo-500/60 hover:text-indigo-400 uppercase tracking-[0.1em] transition-colors">Recover Access</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto"></div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Initialize Portal
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-indigo-200/20 text-[10px] font-black uppercase tracking-[0.2em]">
                System Newcomer?{' '}
                <Link
                  to="/register"
                  className="text-indigo-500 hover:text-indigo-400 transition-colors ml-1"
                >
                  Create Identity
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
