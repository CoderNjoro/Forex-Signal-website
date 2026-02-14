import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Bitcoin, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Globe,
  Wallet,
  Copy,
  Upload,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import paymentService from '../services/payment.service';
import settingsService from '../services/settings.service';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState(new URLSearchParams(location.search).get('method') || 'mpesa');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [prices, setPrices] = useState({ usd: 10, kes: 1300 });
  
  // M-Pesa State
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Crypto State
  const [cryptoData, setCryptoData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings?.premiumSubscriptionPrice) {
          setPrices(settings.premiumSubscriptionPrice);
        }
        
        if (method === 'crypto') {
          const res = await paymentService.initiateCrypto(settings?.premiumSubscriptionPrice?.usd || 10);
          setCryptoData(res);
        }
      } catch (error) {
        toast.error('Failed to initialize checkout');
      } finally {
        setInitLoading(false);
      }
    };
    fetchData();
  }, [method]);

  const handleMpesaSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/\+/g, '');
    const phoneRegex = /^[0-9]{9,12}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Invalid M-Pesa number');
      return;
    }

    setLoading(true);
    try {
      const res = await paymentService.initiateMpesa(cleanPhone, prices.kes);
      toast.success(res.message, { duration: 6000 });
      // Redirect to dashboard or profile after a delay
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoConfirm = async (e) => {
    e.preventDefault();
    if (!transactionId) return toast.error('Transaction ID is required');
    
    setLoading(true);
    try {
      const res = await paymentService.confirmCrypto(cryptoData.paymentId, transactionId, screenshot);
      toast.success(res.message);
      navigate('/profile');
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

  if (initLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-indigo-300/40 font-bold uppercase tracking-widest text-xs">Securing Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/subscription')}
          className="group flex items-center gap-2 text-indigo-300/40 hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Plans
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-4">Complete Your <span className="text-indigo-500">Upgrade</span></h1>
              <p className="text-indigo-300/40 font-medium">You're one step away from institutional-grade trading signals and premium analytics.</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/20 transition-colors" />
              
              <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl tracking-tight">Professional Plan</h3>
                    <p className="text-indigo-300/50 text-xs font-bold uppercase tracking-widest">Lifetime Access</p>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <ul className="space-y-4">
                  {[
                    "Instant Institutional Signals",
                    "Full SL/TP Parameters",
                    "Premium Risk Analytics",
                    "24/7 Priority Concierge"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/70">
                      <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="h-px bg-white/5 w-full" />

                <div className="flex items-center justify-between">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white tracking-tight">
                      {method === 'mpesa' ? `KES ${prices.kes}` : `$${prices.usd}`}
                    </p>
                    {method === 'mpesa' && <p className="text-[10px] text-indigo-300/40 font-bold uppercase">Incl. Gateway Fees</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl">
              <Lock size={18} className="text-indigo-500" />
              <p className="text-[10px] text-indigo-300/60 font-bold uppercase tracking-[0.2em]">Secure 256-bit Encrypted Checkout</p>
            </div>
          </div>

          {/* Payment Method Form */}
          <div className="lg:col-span-7">
            <div className="bg-gray-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
              {/* Method Toggle */}
              <div className="flex border-b border-white/5 p-4 gap-2 bg-gradient-to-b from-white/5 to-transparent">
                <button 
                  onClick={() => setMethod('mpesa')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                    method === 'mpesa' 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                    : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Smartphone size={20} />
                  M-Pesa
                </button>
                <button 
                  onClick={() => setMethod('crypto')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                    method === 'crypto' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Bitcoin size={20} />
                  Crypto
                </button>
              </div>

              <div className="p-10 flex-1 flex flex-col justify-center">
                {method === 'mpesa' ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="max-w-md mx-auto w-full">
                      <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
                          <Smartphone size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">M-Pesa Checkout</h2>
                        <p className="text-indigo-300/40 font-medium">Enter your number to receive an STK push prompt.</p>
                      </div>

                      <form onSubmit={handleMpesaSubmit} className="space-y-6">
                        <div className="space-y-3 group">
                          <label className="block text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] pl-1">Mobile Number</label>
                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300/20 group-focus-within:text-green-500 transition-colors">
                              <Smartphone size={22} />
                            </div>
                            <input
                              type="tel"
                              required
                              placeholder="0712 345 678"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xl outline-none focus:border-green-500/50 focus:bg-white/10 transition-all placeholder:text-white/5"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading || !phoneNumber}
                          className="w-full py-5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-green-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                          ) : (
                            <>
                              Complete Payment
                              <ChevronRight size={24} />
                            </>
                          )}
                        </button>

                        <div className="flex items-start gap-4 p-5 bg-black/40 border border-white/5 rounded-2xl">
                          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-green-500" />
                          </div>
                          <p className="text-[11px] text-white/40 leading-relaxed">
                            A payment request will be sent to <span className="text-white font-bold">{phoneNumber || 'your phone'}</span>. Enter your M-Pesa PIN and wait for confirmation.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="max-w-md mx-auto w-full space-y-8">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                          <Bitcoin size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">USDT Payment</h2>
                        <p className="text-indigo-300/40 font-medium">Send USDT to the address below via <span className="text-indigo-500 font-bold">{cryptoData?.network || 'TRC20'}</span></p>
                      </div>

                      <div className="p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10">
                        <div className="bg-[#0A0C10] p-6 rounded-[1.4rem] space-y-4">
                          <p className="text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.3em] text-center">Wallet Address</p>
                          <div className="flex flex-col gap-4">
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-mono text-xs text-indigo-200 break-all leading-relaxed text-center">
                              {cryptoData?.cryptoAddress || "Generating..."}
                            </div>
                            <button 
                              onClick={() => copyToClipboard(cryptoData?.cryptoAddress)}
                              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold border border-indigo-500/20"
                            >
                              <Copy size={18} />
                              Copy Address
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Transaction ID (Hash)</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10">
                              <Globe size={18} />
                            </div>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="0x..."
                              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm outline-none focus:border-indigo-500/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Payment Proof</label>
                          <input
                            type="file"
                            id="proof-upload"
                            className="hidden"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                          />
                          <label 
                            htmlFor="proof-upload"
                            className={`w-full flex flex-col items-center justify-center gap-3 py-8 bg-white/5 border-2 border-dashed ${screenshot ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 hover:border-indigo-500/40'} rounded-3xl cursor-pointer transition-all`}
                          >
                            {screenshot ? (
                              <div className="text-center">
                                <CheckCircle2 className="text-green-500 mx-auto mb-2" size={24} />
                                <p className="text-white text-xs font-bold">{screenshot.name.substring(0, 20)}...</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="text-white/20" size={24} />
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-wider">Click to upload screenshot</p>
                              </>
                            )}
                          </label>
                        </div>

                        <button
                          onClick={handleCryptoConfirm}
                          disabled={loading || !transactionId}
                          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                          ) : (
                            <>
                              Complete Order
                              <ChevronRight size={24} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure Footer */}
              <div className="p-6 bg-white/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 opacity-30">
                  <ShieldCheck size={14} className="text-white" />
                  <span className="text-[9px] text-white font-bold uppercase tracking-widest">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                  <Lock size={14} className="text-white" />
                  <span className="text-[9px] text-white font-bold uppercase tracking-widest">Instant Activation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
