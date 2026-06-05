import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, HandHeart, Calendar, User, Plus } from 'lucide-react';

/**
 * Native-style bottom tab bar.
 * 5 slots: Home, Requests, +Create (raised center), Events, Profile.
 * - Fixed to the bottom, safe-area padding for the iPhone home indicator.
 * - Active tab is highlighted based on the current route.
 * - Hidden on full-screen auth pages (/login, /register).
 */
const BottomNav = () => {
  const location = useLocation();

  // Hide the bar on auth screens so they feel full-screen / native.
  const hiddenRoutes = ['/login', '/register'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const tabs = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/tasks', label: 'Requests', icon: HandHeart },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const baseTab =
    'flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-medium transition-colors';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative flex items-stretch h-16 max-w-lg mx-auto px-2">
        {/* Left two tabs */}
        {tabs.slice(0, 2).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${baseTab} ${isActive ? 'text-indigo-600' : 'text-slate-400'}`
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Center raised Create button */}
        <div className="flex-1 flex items-start justify-center">
          <NavLink
            to="/create-request"
            aria-label="Create request"
            className="-mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-white active:scale-95 transition-transform"
          >
            <Plus size={28} strokeWidth={2.5} />
          </NavLink>
        </div>

        {/* Right two tabs */}
        {tabs.slice(2).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${baseTab} ${isActive ? 'text-indigo-600' : 'text-slate-400'}`
            }
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
