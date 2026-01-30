import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import NotificationBell from '../notifications/NotificationBell';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Radio, Shield, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e) => {
      // If on auth page, hide unless mouse is in top 80px
      if (isAuthPage) {
        if (e.clientY < 80) {
          setIsVisible(true);
        } else if (!mobileMenuOpen) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [location.pathname, isAuthPage, mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        !isVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl py-2' 
          : isHome 
            ? 'bg-transparent py-4' 
            : 'bg-white dark:bg-gray-900 py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-300">
                <Home className="text-white" size={24} />
              </div>
              <span className={`text-2xl font-black tracking-tight transition-colors ${
                (isHome && !scrolled) ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                Forex<span className="text-indigo-500">Signals</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/signals" label="Live Signals" scrolled={scrolled} isHome={isHome} />
            <NavLink to="/dashboard" label="Dashboard" scrolled={scrolled} isHome={isHome} />
            <NavLink to="/promotions" label="Promotions" scrolled={scrolled} isHome={isHome} />
            {isAdmin && <NavLink to="/admin" label="Admin Portal" scrolled={scrolled} isHome={isHome} />}
            {isSuperAdmin && (
              <Link
                to="/superadmin"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  (isHome && !scrolled) 
                    ? 'text-indigo-300 hover:text-white hover:bg-white/10' 
                    : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                }`}
              >
                SuperAdmin
              </Link>
            )}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
                <NotificationBell />
              </div>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-3 p-1 pr-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-transparent dark:border-gray-700">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  (isHome && !scrolled) ? 'text-white hover:bg-white/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                (isHome && !scrolled) ? 'text-white hover:bg-white/10' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out h-screen fixed inset-0 z-40 bg-white dark:bg-gray-900 p-6 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
            <Home className="text-indigo-600" size={32} />
            <span className="text-2xl font-black dark:text-white">Forex<span className="text-indigo-500">Signals</span></span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><X size={24} /></button>
        </div>
        
        <div className="space-y-4">
          <MobileNavLink to="/signals" label="Live Signals" icon={<Radio size={20}/>} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/dashboard" label="User Dashboard" icon={<LayoutDashboard size={20}/>} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/promotions" label="Promotions & Gifts" icon={<Home size={20}/>} onClick={() => setMobileMenuOpen(false)} />
          {isAdmin && <MobileNavLink to="/admin" label="Admin Portal" icon={<Shield size={20}/>} onClick={() => setMobileMenuOpen(false)} />}
          {isSuperAdmin && <MobileNavLink to="/superadmin" label="SuperAdmin Control" icon={<Shield size={20}/>} onClick={() => setMobileMenuOpen(false)} />}
          <div className="pt-8 border-t dark:border-gray-800">
            {user ? (
               <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-red-600 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl">
                 <LogOut size={20}/> Sign Out
               </button>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center p-4 font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-2xl">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center p-4 font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">Register Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, scrolled, isHome }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
      (isHome && !scrolled) 
        ? 'text-gray-300 hover:text-white hover:bg-white/10' 
        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all font-bold"
  >
    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
      {icon}
    </div>
    {label}
  </Link>
);

export default Navbar;
