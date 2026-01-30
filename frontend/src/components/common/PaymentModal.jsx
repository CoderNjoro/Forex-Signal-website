import React, { useState } from 'react';
import { X, Smartphone, Bitcoin, ArrowRight, ShieldCheck, Copy, CheckCircle2, Upload } from 'lucide-react';
import paymentService from '../../services/payment.service';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, plan }) => {
  const [method, setMethod] = useState('mpesa'); // mpesa or crypto
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Method, 2: Payment Details
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cryptoData, setCryptoData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  if (!isOpen) return null;

  const handleMpesaSubmit = async (e, forcedPhone = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const finalPhone = forcedPhone || phoneNumber;
      // Assuming $10 = 1300 KES
      const res = await paymentService.initiateMpesa(finalPhone, 1300);
      toast.success(res.message);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'M-Pesa initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoInitiate = async () => {
    setLoading(true);
    try {
      const res = await paymentService.initiateCrypto(10);
      setCryptoData(res);
      setStep(2);
    } catch (error) {
      toast.error('Failed to initiate crypto payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await paymentService.confirmCrypto(cryptoData.paymentId, transactionId, screenshot);
      toast.success(res.message);
      onClose();
    } catch (error) {
      toast.error('Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <div>
            <h3 className="text-2xl font-bold text-white">Unlock Pro Access</h3>
            <p className="text-indigo-300/60 text-sm">Elevate your trading with professional tools</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Plan Summary */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-widest">Selected Plan</p>
                    <p className="text-white font-bold text-lg">Pro Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">$10</p>
                  <p className="text-xs text-indigo-300/60">One-time payment</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest ml-1">Payment Method</p>
                
                {/* Method Cards */}
                <button
                  onClick={() => setMethod('mpesa')}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    method === 'mpesa' 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/10' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      method === 'mpesa' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-300'
                    }`}>
                      <Smartphone size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">M-Pesa STK Push</p>
                      <p className="text-indigo-300/50 text-sm">Pay instantly via phone PIN</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    method === 'mpesa' ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                  }`}>
                    {method === 'mpesa' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>

                <button
                  onClick={() => setMethod('crypto')}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    method === 'crypto' 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/10' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      method === 'crypto' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-300'
                    }`}>
                      <Bitcoin size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">Cryptocurrency</p>
                      <p className="text-indigo-300/50 text-sm">USDT (TRC20/ERC20)</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    method === 'crypto' ? 'border-indigo-500 bg-indigo-500' : 'border-white/20'
                  }`}>
                    {method === 'crypto' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              </div>

              {method === 'mpesa' ? (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl text-center">
                    <p className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest mb-2">Payment Destination</p>
                    <p className="text-white text-xl font-mono font-black tracking-wider">0742336537</p>
                    <p className="text-indigo-300/40 text-[10px] mt-2 italic">An STK prompt will be sent to this number for 1,300 KES ($10)</p>
                  </div>
                  <button
                    onClick={() => handleMpesaSubmit({ preventDefault: () => {} }, '0742336537')}
                    disabled={loading}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm and Pay $10 Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCryptoInitiate}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  Continue to Crypto Payment <ArrowRight size={20} />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <Bitcoin size={32} />
                </div>
                <h4 className="text-xl font-bold text-white">Send USDT</h4>
                <p className="text-indigo-300/50 text-sm">Please send exactly $10 of USDT</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <label className="block text-[10px] font-bold text-indigo-300/60 uppercase tracking-[0.2em] mb-2">Wallet Address (USDT TRC20)</label>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm bg-black/40 p-3 rounded-lg border border-white/5 text-white overflow-x-auto">
                      {cryptoData?.cryptoAddress}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(cryptoData?.cryptoAddress)}
                      className="p-3 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="group">
                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">Transaction ID / Hash</label>
                    <input
                      type="text"
                      placeholder="Paste your transaction hash"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 ml-1">Payment Proof (Screenshot)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label 
                        htmlFor="screenshot-upload"
                        className="w-full flex items-center justify-center gap-3 px-4 py-8 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all text-indigo-300/60 font-bold"
                      >
                        {screenshot ? <span className="text-indigo-400 flex items-center gap-2"><CheckCircle2 size={20}/> {screenshot.name}</span> : <><Upload size={24}/> Upload Receipt</>}
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleCryptoConfirm}
                    disabled={loading || !transactionId}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit for Verification <CheckCircle2 size={20} /></>}
                  </button>
                  
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full text-indigo-300/50 hover:text-indigo-300 text-sm font-bold transition-colors"
                  >
                    Back to Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 flex items-center justify-center gap-2 opacity-50">
          <ShieldCheck size={16} className="text-indigo-400" />
          <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Secure SSL Encrypted Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
