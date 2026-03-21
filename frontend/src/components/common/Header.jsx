import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../notification/NotificationBell';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo/Brand */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            LocalAid<span className="text-indigo-600">.np</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav>
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block">
                Dashboard
              </Link>
              <Link to="/organizations" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block">
                NGOs
              </Link>
              <Link to="/events" className="text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors hidden md:block">
                Events
              </Link>
              <Link to="/tasks" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block">
                Task Board
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors hidden md:block">
                  Admin Panel
                </Link>
              )}
              
              <div className="flex items-center gap-5 border-l border-slate-200 pl-6 ml-2">
                
                <NotificationBell />

                {/* CLICKABLE PROFILE SECTION */}
                <Link to="/profile" className="text-right hidden sm:block hover:bg-slate-50 p-1.5 rounded-lg transition-colors group cursor-pointer">
                  <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                  <p className="text-xs font-medium text-slate-400 capitalize">{user.role}</p>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/organizations" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden md:block mr-2">
                NGOs
              </Link>
              <Link to="/events" className="text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors hidden md:block mr-2">
                Events
              </Link>
              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors ml-2">
                Sign In
              </Link>
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                Create Account
              </Link>
            </div>
          )}
        </nav>
        
      </div>
    </header>
  );
};

export default Header;