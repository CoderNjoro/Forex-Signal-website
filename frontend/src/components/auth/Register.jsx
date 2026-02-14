import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, LogIn, Shield, Eye, EyeOff, UserPlus, Fingerprint } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Identity verification failed: Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Security Protocol: Access Key must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Identity Created Successfully');
      navigate('/dashboard');
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-[#050505]">
       {/* Dynamic Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[20%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
      />

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative bg-[#0A0C10]/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600/10 rounded-3xl mb-6 border border-indigo-500/20 shadow-inner">
                <Fingerprint className="text-indigo-500" size={40} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                New <span className="text-indigo-500 uppercase italic">Identity</span>
              </h2>
              <p className="text-indigo-200/30 text-[10px] font-black uppercase tracking-[0.3em]">
                Initialize Security Protocol
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    Handle
                  </label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="username"
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium"
                      placeholder="TradersAlias"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    System Address
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium"
                      placeholder="address@node.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                      Access Key
                    </label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono text-sm"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/20 hover:text-indigo-400"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                      Verify
                    </label>
                    <div className="relative group/input">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono text-sm"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/20 hover:text-indigo-400"
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto"></div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Request Identity Creation
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-indigo-200/20 text-[10px] font-black uppercase tracking-[0.2em]">
                Already Verified?{' '}
                <Link
                  to="/login"
                  className="text-indigo-500 hover:text-indigo-400 transition-colors ml-1"
                >
                  Access Portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
