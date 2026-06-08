import React, { useState, useEffect } from 'react';

/**
 * Branded splash shown for ~2.5s on app launch, then fades out.
 * Uses the LocalAid mark from /public. Mobile-first, covers the screen.
 *
 * Wrap your app with this in App.jsx (see instructions).
 */
const SplashScreen = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show splash on first load of the session
    const seen = sessionStorage.getItem('splashSeen');
    if (seen) {
      setShowSplash(false);
      return;
    }
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splashSeen', '1');
    }, 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <img
            src="/logo-mark-256.png"
            alt="LocalAid"
            className="w-32 h-32 animate-pulse"
          />
          <div className="mt-6 text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">local</span>
            <span className="text-emerald-500">aid</span>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Community-centric social support
          </p>
        </div>
      )}
      {children}
    </>
  );
};

export default SplashScreen;
