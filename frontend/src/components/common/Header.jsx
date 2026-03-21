import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../notification/NotificationBell';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

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
                Dashboard
              </Link>
              <Link to="/organizations" className={`text-sm font-medium transition-colors ${isActive('/organizations') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                NGOs
              </Link>
              <Link to="/events" className={`text-sm font-medium transition-colors ${isActive('/events') ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-amber-600'}`}>
                Events
              </Link>
              <Link to="/tasks" className={`text-sm font-medium transition-colors ${isActive('/tasks') ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-indigo-600'}`}>
                Task Board
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" className={`text-sm font-bold transition-colors ${isActive('/admin') ? 'text-rose-700' : 'text-rose-500 hover:text-rose-700'}`}>
                  Admin Panel
                </Link>
              )}
              
              <div className="flex items-center gap-5 border-l border-slate-200 pl-6 ml-2">
                <NotificationBell />
                <Link to="/profile" className="text-right hover:bg-slate-50 p-1.5 rounded-lg transition-colors group cursor-pointer">
                  <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                  <p className="text-xs font-medium text-slate-400 capitalize">{user.role}</p>
                </Link>
                <button onClick={handleLogout} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/organizations" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">NGOs</Link>
              <Link to="/events" className="text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors mr-2">Events</Link>
              <div className="h-6 w-px bg-slate-200"></div>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors ml-2">Sign In</Link>
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">Create Account</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu & Bell Container */}
        <div className="flex md:hidden items-center gap-4">
          {user && <NotificationBell />}
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          >
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl overflow-hidden animate-slide-up origin-top">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user ? (
              <>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs font-medium text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <Link to="/profile" onClick={closeMenu} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Profile</Link>
                </div>
                <Link to="/dashboard" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Dashboard</Link>
                <Link to="/organizations" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">NGO Directory</Link>
                <Link to="/events" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600">Community Events</Link>
                <Link to="/tasks" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600">Volunteer Task Board</Link>
                
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-rose-600 bg-rose-50 border border-rose-100">Security & Admin Panel</Link>
                )}
                
                <button onClick={handleLogout} className="w-full text-left mt-4 px-4 py-3 font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/organizations" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">NGO Directory</Link>
                <Link to="/events" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50">Community Events</Link>
                <div className="h-px bg-slate-100 my-2"></div>
                <Link to="/login" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-slate-700 border border-slate-200 mb-2">Sign In</Link>
                <Link to="/register" onClick={closeMenu} className="block px-4 py-3 rounded-xl font-bold text-white bg-slate-900 text-center">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;