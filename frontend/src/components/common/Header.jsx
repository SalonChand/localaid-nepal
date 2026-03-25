import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../notification/NotificationBell';
import { useTranslation } from 'react-i18next'; // IMPORT TRANSLATION HOOK

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const[isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize translation hook
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  // Toggle Language Function
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo/Brand */}
        <Link to={user ? "/dashboard" : "/"} onClick={closeMenu} className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            LocalAid<span className="text-indigo-600">.np</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                {t('header.dashboard')}
              </Link>
              <Link to="/organizations" className={`text-sm font-medium transition-colors ${isActive('/organizations') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                {t('header.ngos')}
              </Link>
              <Link to="/events" className={`text-sm font-medium transition-colors ${isActive('/events') ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-amber-600'}`}>
                {t('header.events')}
              </Link>
              {user.role === 'volunteer' && (
                <>
                  <Link to="/tasks" className={`text-sm font-medium transition-colors ${isActive('/tasks') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                    {t('header.tasks')}
                  </Link>
                  <Link to="/my-tasks" className={`text-sm font-medium transition-colors ${isActive('/my-tasks') ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-emerald-600'}`}>
                    {t('header.myTasks')}
                  </Link>
                </>
              )}
              {user.role === 'organization' && (
                <Link to="/tasks" className={`text-sm font-medium transition-colors ${isActive('/tasks') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                  {t('header.tasks')}
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin" className={`text-sm font-bold transition-colors ${isActive('/admin') ? 'text-rose-700' : 'text-rose-500 hover:text-rose-700'}`}>
                  {t('header.admin')}
                </Link>
              )}
              
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6 ml-2">
                
                {/* LANGUAGE TOGGLE BUTTON */}
                <button onClick={toggleLanguage} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-200">
                  {i18n.language === 'en' ? 'नेप' : 'EN'}
                </button>

                <NotificationBell />
                <Link to="/profile" className="text-right hover:bg-slate-50 p-1.5 rounded-lg transition-colors group cursor-pointer">
                  <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                </Link>
                <button onClick={handleLogout} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow">
                  {t('header.signOut')}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/organizations" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">{t('header.ngos')}</Link>
              <Link to="/events" className="text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors mr-2">{t('header.events')}</Link>
              
              <div className="h-6 w-px bg-slate-200"></div>

              {/* LANGUAGE TOGGLE BUTTON */}
              <button onClick={toggleLanguage} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-200 ml-2">
                {i18n.language === 'en' ? 'नेप' : 'EN'}
              </button>

              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors ml-2">{t('header.signIn')}</Link>
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">{t('header.createAccount')}</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu & Bell Container */}
        <div className="flex md:hidden items-center gap-3">
          {/* MOBILE LANGUAGE TOGGLE */}
          <button onClick={toggleLanguage} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
            {i18n.language === 'en' ? 'नेप' : 'EN'}
          </button>

          {user && <NotificationBell />}
          
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden origin-top">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user ? (
              <>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase">{user.role}</p>
                  </div>
                  <Link to="/profile" onClick={closeMenu} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Profile</Link>
                </div>
                <Link to="/dashboard" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">{t('header.dashboard')}</Link>
                <Link to="/organizations" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">{t('header.ngos')}</Link>
                <Link to="/events" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600">{t('header.events')}</Link>
                
                {user.role === 'volunteer' && (
                  <>
                    <Link to="/tasks" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">{t('header.tasks')}</Link>
                    <Link to="/my-tasks" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600">{t('header.myTasks')}</Link>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-rose-600 bg-rose-50 border border-rose-100">{t('header.admin')}</Link>
                )}
                
                <button onClick={handleLogout} className="w-full text-left mt-4 px-4 py-3 font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">{t('header.signOut')}</button>
              </>
            ) : (
              <>
                <Link to="/organizations" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">{t('header.ngos')}</Link>
                <Link to="/events" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">{t('header.events')}</Link>
                <div className="h-px bg-slate-100 my-2"></div>
                <Link to="/login" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-slate-700 border border-slate-200 mb-2">{t('header.signIn')}</Link>
                <Link to="/register" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-white bg-slate-900 text-center">{t('header.createAccount')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;