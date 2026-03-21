import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4 tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live in Nepal
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Community Support, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
            Coordinated & Delivered.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          A centralized platform connecting citizens in need with dedicated volunteers and verified organizations across Nepal.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          {user ? (
            <Link to="/dashboard" className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              Go to My Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                Create Account
              </Link>
              <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-3.5 px-8 rounded-xl shadow-sm transition-all duration-300">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;