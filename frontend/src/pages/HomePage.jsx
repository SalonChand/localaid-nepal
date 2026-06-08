import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  HandHeart,
  HeartHandshake,
  Calendar,
  Building2,
  Phone,
  ArrowRight,
} from 'lucide-react';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // Quick actions wired to your real routes.
  // Each card: route, label, sublabel, icon, and a color accent.
  const actions = [
    {
      to: '/create-request',
      label: 'Request Help',
      sub: 'Food, medical, shelter & more',
      Icon: HandHeart,
      accent: 'bg-indigo-50 text-indigo-600',
      span: true, // full-width hero action
    },
    {
      to: '/tasks',
      label: 'Volunteer',
      sub: 'Help people nearby',
      Icon: HeartHandshake,
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      to: '/events',
      label: 'Events',
      sub: 'Drives & camps',
      Icon: Calendar,
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      to: '/organizations',
      label: 'NGO Directory',
      sub: 'Verified orgs',
      Icon: Building2,
      accent: 'bg-sky-50 text-sky-600',
    },
    {
      to: '/dashboard',
      label: 'My Activity',
      sub: 'Requests & tasks',
      Icon: ArrowRight,
      accent: 'bg-slate-100 text-slate-700',
    },
  ];

  const firstName = user?.name ? user.name.split(' ')[0] : null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50">
      {/* Greeting header */}
      <div className="px-5 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-3 tracking-wide">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
          </span>
          Live in Nepal
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {firstName ? (
            <>Namaste, {firstName} 👋</>
          ) : (
            <>Namaste 👋</>
          )}
        </h1>
        <p className="text-slate-500 mt-1 text-[15px]">
          How can we help your community today?
        </p>
      </div>

      {/* Quick-action grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {actions.map(({ to, label, sub, Icon, accent, span }) => (
          <Link
            key={to}
            to={to}
            className={`${
              span ? 'col-span-2' : ''
            } group bg-white rounded-2xl border border-slate-200 p-4 active:scale-[0.98] transition-transform`}
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-xl ${accent} mb-3`}
            >
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className="font-bold text-slate-900 text-[15px] leading-tight">
              {label}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
          </Link>
        ))}
      </div>

      {/* Logged-out CTA */}
      {!user && (
        <div className="px-5 mt-6 space-y-3">
          <Link
            to="/register"
            className="block w-full text-center bg-slate-900 active:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="block w-full text-center bg-white text-slate-700 border border-slate-200 font-semibold py-3.5 rounded-xl"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Emergency banner — always visible, taps to phone dialer */}
      <div className="px-5 mt-6">
        <a
          href="tel:100"
          className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-4 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-600 text-white shrink-0">
            <Phone size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-rose-700 text-[15px]">Emergency?</div>
            <div className="text-rose-500 text-xs">
              Tap to call Police Control · 100
            </div>
          </div>
        </a>
      </div>

      <div className="h-6" />
    </div>
  );
};

export default HomePage;
