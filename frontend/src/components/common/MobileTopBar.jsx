import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Minimal app-style top bar for mobile.
 * Compact, sticky, just the brand mark — the bottom nav does the navigating.
 * Hidden on auth screens so login/register feel full-screen.
 *
 * NOTE: This is the MOBILE bar. Your existing <Header /> is kept for
 * desktop (md and up) — see App.jsx where each is shown at the right breakpoint.
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
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white text-sm font-bold">
            L
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            LocalAid<span className="text-indigo-600">.np</span>
          </span>
        </Link>

        {/* Right slot: keep your language toggle / notifications here later */}
        <div className="flex items-center gap-2" />
      </div>
    </header>
  );
};

export default MobileTopBar;
