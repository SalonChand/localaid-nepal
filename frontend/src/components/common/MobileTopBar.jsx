import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Minimal app-style top bar for mobile.
 * Shows the LocalAid logo mark + wordmark. Hidden on auth screens.
 */
const MobileTopBar = () => {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <header
      className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 md:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-mark-256.png"
            alt="LocalAid"
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            local<span className="text-emerald-500">aid</span>
          </span>
        </Link>

        {/* Right slot: language toggle / notifications can go here later */}
        <div className="flex items-center gap-2" />
      </div>
    </header>
  );
};

export default MobileTopBar;
