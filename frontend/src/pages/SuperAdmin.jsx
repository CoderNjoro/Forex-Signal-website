import React, { useState, useEffect } from 'react';
import { superAdminService } from '../services/superadmin.service';
import settingsService from '../services/settings.service';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  UserCheck,
  UserX,
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  DollarSign,
  Bitcoin,
  Wallet,
  CreditCard,
  Smartphone,
  Crown
} from 'lucide-react';

const SuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [overview, setOverview] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'logs', 'settings', 'subscriptions' or 'payments'
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [logAction, setLogAction] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [subscriptionSettings, setSubscriptionSettings] = useState({ usd: 10, kes: 1300 });
  const [cryptoSettings, setCryptoSettings] = useState({ usdtAddress: '', network: 'TRC20', walletLabel: 'USDT (TRC20)' });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [cryptoLoading, setCryptoLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings?.premiumSubscriptionPrice) {
        setSubscriptionSettings(settings.premiumSubscriptionPrice);
      }
      if (settings?.cryptoSettings) {
        setCryptoSettings(settings.cryptoSettings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  useEffect(() => {
    if (activeView === 'logs') {
      fetchLogs();
    } else if (activeView === 'subscriptions') {
      fetchSubscriptions();
    } else if (activeView === 'payments') {
      fetchPayments();
    }
  }, [page, activeView, logAction]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [adminsData, overviewData] = await Promise.all([
        superAdminService.getAdmins(),
        superAdminService.getOverview()
      ]);
      setAdmins(adminsData);
      setOverview(overviewData);
    } catch (error) {
      toast.error('Failed to fetch superadmin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const data = await superAdminService.getActivityLogs(page, logAction);
      setActivityLogs(data.activities);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load detailed activity logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      const data = await superAdminService.getPayments(page);
      setPayments(data.payments);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch payments data');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setSubsLoading(true);
      const data = await superAdminService.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      toast.error('Failed to fetch premium subscriptions');
    } finally {
      setSubsLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const updated = await superAdminService.toggleAdminBlock(id);
      setAdmins(admins.map(a => a._id === id ? { ...a, isAdminBlocked: updated.isAdminBlocked } : a));
      toast.success(updated.isAdminBlocked ? 'Admin blocked' : 'Admin unblocked');
      if (activeView === 'logs') fetchLogs(); // Refresh logs if visible
      fetchInitialData(); // Refresh summary
    } catch (error) {
      toast.error('Failed to toggle admin status');
    }
  };

  const handleTogglePromoPermission = async (id) => {
    try {
      const updated = await superAdminService.togglePromotionPermission(id);
      setAdmins(admins.map(a => a._id === id ? { ...a, canCreatePromotions: updated.canCreatePromotions } : a));
      toast.success(updated.canCreatePromotions ? 'Promotion permission granted' : 'Promotion permission revoked');
    } catch (error) {
      toast.error('Failed to update promotion permission');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const admin = await superAdminService.createAdmin(newAdmin);
      setAdmins([admin, ...admins]);
      setShowAddModal(false);
      setNewAdmin({ username: '', email: '', password: '' });
      toast.success('Admin created successfully');
      fetchInitialData(); // Refresh overview/summary
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleUpdateSubscriptionPrice = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      await settingsService.updateSubscriptionPrice(
        subscriptionSettings.usd,
        subscriptionSettings.kes
      );
      toast.success('Subscription price updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subscription price');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdateCryptoSettings = async (e) => {
    e.preventDefault();
    setCryptoLoading(true);
    try {
      await settingsService.updateCryptoSettings(cryptoSettings);
      toast.success('Crypto payment settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update crypto settings');
    } finally {
      setCryptoLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Superadmin Control Center</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Full platform oversight and administrator management</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none font-semibold"
        >
          <UserPlus size={20} />
          Add New Admin
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveView('overview')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeView === 'overview' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveView('subscriptions')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeView === 'subscriptions' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Subscriptions
        </button>
        <button 
          onClick={() => { setActiveView('payments'); setPage(1); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeView === 'payments' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Payments
        </button>
        <button 
          onClick={() => { setActiveView('logs'); setPage(1); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeView === 'logs' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Activity Logs
        </button>
        <button 
          onClick={() => setActiveView('settings')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeView === 'settings' 
            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Settings
        </button>
      </div>

      {activeView === 'settings' ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Settings size={28} className="text-indigo-600" />
              Subscription Price Settings
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Configure premium subscription pricing for testing payment integrations</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleUpdateSubscriptionPrice} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    USD Price
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <DollarSign size={20} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                      placeholder="10.00"
                      value={subscriptionSettings.usd}
                      onChange={(e) => setSubscriptionSettings({...subscriptionSettings, usd: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Price in US Dollars for cryptocurrency payments</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    KES Price
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <DollarSign size={20} />
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                      placeholder="1300"
                      value={subscriptionSettings.kes}
                      onChange={(e) => setSubscriptionSettings({...subscriptionSettings, kes: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Price in Kenyan Shillings for M-Pesa payments</p>
                </div>
              </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                >
                  {settingsLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Settings size={20} />
                      Update Subscription Price
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
                <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                  <strong>Note:</strong> Changes will immediately affect the subscription page and payment flows. Use this to test payment integrations with different amounts.
                </p>
              </div>
            </form>
          </div>

          <div className="p-8 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
              <Bitcoin size={28} className="text-orange-500" />
              Crypto Payment Settings
            </h2>
            
            <form onSubmit={handleUpdateCryptoSettings} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    USDT (TRC20) Wallet Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Wallet size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                      placeholder="T..."
                      value={cryptoSettings.usdtAddress}
                      onChange={(e) => setCryptoSettings({...cryptoSettings, usdtAddress: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">The USDT address where you will receive payments</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Network
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Globe size={20} />
                    </div>
                    <select
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold appearance-none"
                      value={cryptoSettings.network}
                      onChange={(e) => setCryptoSettings({...cryptoSettings, network: e.target.value})}
                    >
                      <option value="TRC20">TRC20 (Recommended)</option>
                      <option value="ERC20">ERC20</option>
                      <option value="BEP20">BEP20</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Wallet Label
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <CreditCard size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                      placeholder="USDT (TRC20)"
                      value={cryptoSettings.walletLabel}
                      onChange={(e) => setCryptoSettings({...cryptoSettings, walletLabel: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={cryptoLoading}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-xl shadow-orange-200 dark:shadow-none flex items-center justify-center gap-2"
                >
                  {cryptoLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Bitcoin size={20} />
                      Update Crypto Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : activeView === 'subscriptions' ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Crown size={28} className="text-indigo-600" />
              Premium Subscriptions
            </h2>
            <button 
              onClick={fetchSubscriptions}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
              title="Refresh subscriptions"
            >
              <Activity size={20} className={subsLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Subscribed Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {subsLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-6"><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div></td>
                    </tr>
                  ))
                ) : subscriptions.length > 0 ? (
                  subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                            {sub.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{sub.username}</p>
                            <p className="text-sm text-gray-500">{sub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          sub.payment?.method === 'mpesa' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {sub.payment?.method === 'mpesa' ? <Smartphone size={14} /> : <Bitcoin size={14} />}
                          {sub.payment?.method === 'mpesa' ? 'M-Pesa' : 'Crypto'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {sub.payment?.currency} {sub.payment?.amount?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {sub.payment?.date ? formatDate(sub.payment.date) : formatDate(sub.createdAt)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                           {sub.expiresAt ? (new Date(sub.expiresAt).getFullYear() > 2100 ? 'Lifetime' : formatDate(sub.expiresAt)) : 'Lifetime'}
                         </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500 font-medium">
                      No premium subscriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeView === 'overview' ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={overview?.totalUsers || 0} 
              icon={<Users className="text-blue-600" />}
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard 
              title="Premium Subscriptions" 
              value={overview?.premiumUsers || 0} 
              icon={<TrendingUp className="text-emerald-600" />}
              bgColor="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <StatCard 
              title="Active Admins" 
              value={overview?.totalAdmins || 0} 
              icon={<ShieldCheck className="text-indigo-600" />}
              bgColor="bg-indigo-50 dark:bg-indigo-900/20"
            />
            <StatCard 
              title="Platform Growth" 
              value={`${((overview?.premiumUsers / overview?.totalUsers) * 100 || 0).toFixed(1)}%`}
              icon={<Activity className="text-amber-600" />}
              bgColor="bg-amber-50 dark:bg-amber-900/20"
              subtitle="Premium conversion"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Admin Management Table */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield size={24} className="text-indigo-600" />
                  Manage Administrators
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Permissions</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-lg">
                              {admin.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{admin.username}</p>
                              <p className="text-sm text-gray-500">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {admin.isAdminBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <ShieldAlert size={14} /> Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <ShieldCheck size={14} /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <button
                            onClick={() => handleTogglePromoPermission(admin._id)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              admin.canCreatePromotions 
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            }`}
                          >
                            <Globe size={14} />
                            {admin.canCreatePromotions ? 'Promo: ON' : 'Promo: OFF'}
                          </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleToggleBlock(admin._id)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                              admin.isAdminBlocked 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                          >
                            {admin.isAdminBlocked ? <UserCheck size={18} /> : <UserX size={18} />}
                            {admin.isAdminBlocked ? 'Restore Access' : 'Block Access'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Activity Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Activity size={24} className="text-indigo-600" />
                  Recent Activity
                </h2>
                <button 
                  onClick={() => setActiveView('logs')}
                  className="text-indigo-600 font-bold text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="p-8 space-y-8 flex-1">
                {overview?.recentActivities?.length > 0 ? (
                  overview.recentActivities.map((act, i) => (
                    <div key={act._id || i} className="flex gap-5">
                      <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        act.user?.role === 'admin' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'bg-gray-50 text-gray-600 dark:bg-gray-900/40'
                      }`}>
                        {act.user?.role === 'admin' ? <Shield size={18} /> : <Users size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                          {act.user?.username || 'System'}{' '}
                          <span className="font-medium text-gray-600 dark:text-gray-400">{act.action}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                          {formatDate(act.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <Database size={40} className="text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium">No activity logs recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : activeView === 'payments' ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <DollarSign size={28} className="text-emerald-600" />
              Payment History & Tracking
            </h2>
            <button 
              onClick={fetchPayments}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
            >
              <Activity size={20} className={paymentsLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paymentsLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-8 py-6"><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div></td>
                    </tr>
                  ))
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <p className="text-sm font-semibold">{formatDate(payment.createdAt)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.user?.username || 'Deleted User'}</p>
                          <p className="text-xs text-gray-500">{payment.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold">{payment.currency} {payment.amount}</p>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          payment.paymentMethod === 'mpesa' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {payment.paymentMethod === 'mpesa' ? <Smartphone size={14} /> : <Bitcoin size={14} />}
                          {payment.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Crypto'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${
                          payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-mono text-gray-500 truncate max-w-[150px]" title={payment.transactionId}>
                          {payment.transactionId || payment.checkoutRequestID || 'N/A'}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center text-gray-500 font-medium">
                      No payment records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Payments */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing page <span className="text-gray-900 dark:text-white font-bold">{page}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
            </p>
            <div className="flex gap-3">
              <button 
                disabled={page === 1 || paymentsLoading}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button 
                disabled={page === totalPages || paymentsLoading}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Activity Logs View */
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Database size={28} className="text-indigo-600" />
              Detailed System Audit Logs
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>
              <select 
                value={logAction}
                onChange={(e) => { setLogAction(e.target.value); setPage(1); }}
                className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 text-sm outline-none"
              >
                <option value="">All Actions</option>
                <option value="view_signal">Signal Views</option>
                <option value="payment_initiated">Payment Starts</option>
                <option value="payment_completed">Payment Success</option>
                <option value="payment_failed">Payment Fails</option>
                <option value="login">Logins</option>
                <option value="create_signal">Admin: Create Signal</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Administrator</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logsLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-8 py-6"><div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full w-full"></div></td>
                    </tr>
                  ))
                ) : activityLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(log.createdAt)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-xs text-indigo-600">
                          {log.user?.username ? log.user.username[0].toUpperCase() : '?'}
                        </div>
                        <p className="text-sm font-semibold">{log.user?.username || 'System'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${
                        log.action.includes('error') ? 'bg-red-100 text-red-700' :
                        log.action.includes('create') ? 'bg-emerald-100 text-emerald-700' :
                        log.action.includes('delete') ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {log.countryCode && log.countryCode !== 'LOCAL' ? (
                          <img 
                            src={`https://flagcdn.com/w20/${log.countryCode.toLowerCase()}.png`} 
                            alt={log.country}
                            className="w-5 rounded-sm"
                          />
                        ) : (
                          <Globe size={16} className="text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {log.country || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                        {log.ipAddress || 'Internal'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing page <span className="text-gray-900 dark:text-white font-bold">{page}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span>
            </p>
            <div className="flex gap-3">
              <button 
                disabled={page === 1 || logsLoading}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button 
                disabled={page === totalPages || logsLoading}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <UserPlus size={30} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Generate New Admin</h2>
              <p className="text-gray-500 mb-8 font-medium">Securely create a new administrator account with full platform access.</p>
              
              <form onSubmit={handleCreateAdmin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                    placeholder="Enter username"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                    placeholder="Enter email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
                    placeholder="••••••••"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200 dark:shadow-none"
                  >
                    Confirm & Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor, subtitle }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md group">
    <div className="flex items-center justify-between mb-6">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
    </div>
    <h3 className="text-gray-400 dark:text-gray-500 text-xs font-extrabold uppercase tracking-widest">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 font-semibold">{subtitle}</p>}
    </div>
  </div>
);

export default SuperAdmin;
