import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, ShieldAlert, Lock, Key, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: token + new password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success('Reset code sent! Check your console for the code (development mode)');
      
      // In development, show the token
      if (response.data.resetToken) {
        toast.success(`Your reset code: ${response.data.resetToken}`, { duration: 10000 });
      }
      
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword
      });
      
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] px-6">
        <div className="relative bg-[#0A0C10]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.8rem] shadow-2xl">
          {step === 1 ? (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 rounded-2xl mb-6 border border-red-500/20 shadow-inner">
                  <ShieldAlert className="text-red-500" size={32} />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3 uppercase italic">
                  Access <span className="text-red-500">Recovery</span>
                </h2>
                <p className="text-indigo-200/40 text-sm font-medium tracking-wide">
                  Enter your email to receive a reset code
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleRequestReset}>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    System Address
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-red-500/50 focus:bg-white/[0.05] outline-none transition-all font-medium"
                      placeholder="address@node.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden px-8 py-5 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-2xl shadow-red-600/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto"></div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Reset Code
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/10 rounded-2xl mb-6 border border-indigo-500/20 shadow-inner">
                  <Key className="text-indigo-500" size={32} />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-3 uppercase">
                  New <span className="text-indigo-500">Credentials</span>
                </h2>
                <p className="text-indigo-200/40 text-sm font-medium tracking-wide">
                  Enter the code sent to <span className="text-indigo-300">{email}</span>
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    Reset Code
                  </label>
                  <div className="relative group/input">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono text-center tracking-widest"
                      placeholder="000000"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    New Access Key
                  </label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] ml-1">
                    Confirm New Key
                  </label>
                  <div className="relative group/input">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all font-mono"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
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
                      Reset Password
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60 hover:text-indigo-400 transition-colors"
                >
                  Use different email
                </button>
              </form>
            </>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <ArrowLeft size={14} />
              Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

