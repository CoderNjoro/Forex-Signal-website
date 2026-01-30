import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, LogIn, Shield } from 'lucide-react';
import loginBg from '../../assets/login-bg.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-100"
        style={{ 
          backgroundImage: `url(${loginBg})`,
          filter: 'brightness(0.6) contrast(1.1)'
        }}
      />
      
      {/* Animated Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass-card shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5 dark:bg-gray-900/20 p-8 rounded-[2.5rem]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              Join the Elite
            </h2>
            <p className="text-indigo-200/70 font-medium">
              Start your professional trading journey
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">
                  Unique Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/40 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-semibold"
                    placeholder="Choose a handle"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/40 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-semibold"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/40 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-semibold"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">
                  Verify Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-300/40 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-semibold"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    Create Secure Account
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-indigo-200/50 text-sm font-medium">
              Already a member?{' '}
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
