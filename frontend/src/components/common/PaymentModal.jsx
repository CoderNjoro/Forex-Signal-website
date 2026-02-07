import React, { useState } from 'react';
import { X, Smartphone, Bitcoin, ArrowRight, ShieldCheck, Copy, CheckCircle2, Upload, ChevronLeft, Loader2 } from 'lucide-react';
import paymentService from '../../services/payment.service';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, plan }) => {
  const [method, setMethod] = useState(null); // 'mpesa' or 'crypto'
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Method, 2: Payment Details
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cryptoData, setCryptoData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  if (!isOpen) return null;

  const handleMethodSelect = async (selectedMethod) => {
    setMethod(selectedMethod);
    if (selectedMethod === 'mpesa') {
        setStep(2);
    } else if (selectedMethod === 'crypto') {
        await handleCryptoInitiate();
    }
  };

  const handleBack = () => {
    setStep(1);
    setMethod(null);
    setPhoneNumber('');
  };

  const handleMpesaSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    // Clean phone number (remove spaces and +)
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/\+/g, '');
    
    const phoneRegex = /^[0-9]{9,12}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid M-Pesa phone number (e.g., 0712345678 or 254712345678)');
      return;
    }

    setLoading(true);
    try {
      const kesAmount = plan?.kesPrice || 1300; 
      const res = await paymentService.initiateMpesa(cleanPhone, kesAmount);
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
      const usdAmount = plan?.price || 10;
      const res = await paymentService.initiateCrypto(usdAmount);
      setCryptoData(res);
      setStep(2);
    } catch (error) {
      toast.error('Failed to initiate crypto payment');
      setMethod(null); // Reset selection on fail
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#0F1115] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-indigo-500/5 to-transparent">
          <div className="flex items-center gap-3">
             {step === 2 && (
                <button 
                  onClick={handleBack}
                  className="p-1.5 -ml-2 rounded-lg hover:bg-white/5 text-indigo-300/60 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
             )}
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                {step === 1 ? "Select Payment" : method === 'mpesa' ? "M-Pesa Payment" : "Crypto Payment"}
              </h3>
              <p className="text-indigo-300/40 text-xs font-medium tracking-wider uppercase mt-1">
                {step === 1 ? "Choose your preferred method" : "Secure Checkout"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* Plan Summary - Always Visible but smaller in Step 2 */}
          <div className={`mb-8 p-5 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-500/20 flex items-center justify-between transition-all duration-300 ${step === 2 ? 'opacity-60 scale-[0.98]' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-indigo-300/80 font-bold uppercase tracking-wider">Plan</p>
                <p className="text-white font-bold text-base">Pro Subscription</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-white tracking-tight">${plan?.price || 10}</p>
              <p className="text-[10px] text-indigo-300/60 font-medium">Lifetime</p>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
              <p className="text-xs font-bold text-indigo-200/40 uppercase tracking-widest pl-1">Payment Options</p>
              
              <button
                onClick={() => handleMethodSelect('mpesa')}
                disabled={loading}
                className="w-full group relative overflow-hidden p-0.5 rounded-2xl transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#13161B] hover:bg-[#161a20] border border-white/5 group-hover:border-green-500/30 rounded-2xl p-5 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-green-500/25">
                      <Smartphone size={28} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-lg">M-Pesa</p>
                      <p className="text-indigo-300/40 text-xs mt-0.5 font-medium">Instant automated push</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                    <ArrowRight size={16} className="text-white/20 group-hover:text-white" />
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelect('crypto')}
                disabled={loading}
                className="w-full group relative overflow-hidden p-0.5 rounded-2xl transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#13161B] hover:bg-[#161a20] border border-white/5 group-hover:border-indigo-500/30 rounded-2xl p-5 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-indigo-500/25">
                      <Bitcoin size={28} />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-lg">Crypto</p>
                      <p className="text-indigo-300/40 text-xs mt-0.5 font-medium">USDT (TRC20/ERC20)</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                     {loading && method === 'crypto' ? <Loader2 size={16} className="animate-spin text-white"/> : <ArrowRight size={16} className="text-white/20 group-hover:text-white" />}
                  </div>
                </div>
              </button>
            </div>
          ) : method === 'mpesa' ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="text-center pb-2">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-lg shadow-green-500/10">
                  <Smartphone size={32} />
                </div>
                <h4 className="text-lg font-bold text-white">Enter M-Pesa Number</h4>
                <p className="text-indigo-300/50 text-xs mt-2 max-w-[200px] mx-auto leading-relaxed">
                  We'll send an STK prompt to your phone. Enter your PIN to complete.
                </p>
              </div>

              <form onSubmit={handleMpesaSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest pl-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/30 group-focus-within:text-green-500 transition-colors">
                      <Smartphone size={20} />
                    </div>
                    <input
                      type="tel"
                      placeholder="0712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-[#13161B] border border-white/10 rounded-2xl text-white outline-none focus:border-green-500/50 focus:bg-[#161a20] transition-all font-mono text-lg placeholder:text-indigo-300/20"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full py-5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-green-600/20 hover:shadow-green-600/40 flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      Pay KES {plan?.kesPrice || 1300}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="space-y-5">
                <div className="p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/20 overflow-hidden">
                   <div className="bg-[#13161B] p-4 rounded-xl">
                      <label className="block text-[10px] font-bold text-indigo-300/60 uppercase tracking-[0.2em] mb-3 text-center">Send USDT (TRC20) To</label>
                      <div className="flex items-center gap-3">
                        <code className="flex-1 text-xs sm:text-sm bg-black/40 p-4 rounded-xl border border-white/5 text-indigo-200 font-mono overflow-x-auto whitespace-nowrap">
                          {cryptoData?.cryptoAddress || "Generating..."}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(cryptoData?.cryptoAddress)}
                          className="p-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                          title="Copy Address"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                   </div>
                </div>

                <div className="space-y-5 pt-2">
                  <div className="group space-y-2">
                    <label className="block text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest pl-1">Transaction ID (Hash)</label>
                    <input
                      type="text"
                      placeholder="Paste your transaction hash"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-5 py-4 bg-[#13161B] border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-500/50 transition-all font-mono text-sm"
                    />
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest pl-1">Upload Receipt</label>
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
                        className={`w-full flex items-center justify-center gap-3 px-4 py-6 bg-[#13161B] border-2 border-dashed ${screenshot ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-indigo-500/50'} rounded-2xl cursor-pointer transition-all text-sm font-bold`}
                      >
                        {screenshot ? (
                          <span className="text-green-400 flex items-center gap-2">
                            <CheckCircle2 size={20}/> {screenshot.name.substring(0, 20)}...
                          </span>
                        ) : (
                          <span className="text-indigo-300/50 flex items-center gap-2">
                            <Upload size={20}/> Click to upload screenshot
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleCryptoConfirm}
                    disabled={loading || !transactionId}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <>Confirm Payment <CheckCircle2 size={20} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="px-8 pb-6 flex items-center justify-center gap-2 opacity-30 mt-auto">
          <ShieldCheck size={14} className="text-white" />
          <span className="text-[10px] text-white uppercase tracking-widest font-bold">Encrypted & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
