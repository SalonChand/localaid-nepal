import React, { useEffect, useState } from 'react';
import { syncOfflineRequests } from '../../services/offlineSyncService';

const OfflineSyncManager = () => {
  const[isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      // The millisecond internet returns, try to sync!
      const count = await syncOfflineRequests();
      if (count > 0) {
        setSyncMessage(`Success! Automatically synced ${count} offline request(s) to the server.`);
        // Hide the success message after 5 seconds
        setTimeout(() => setSyncMessage(''), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },[]);

  if (isOnline && !syncMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {!isOnline && (
        <div className="bg-orange-500 text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          You are offline. Requests will be saved locally.
        </div>
      )}
      {syncMessage && (
        <div className="bg-emerald-500 text-white px-6 py-2.5 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-slide-up">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {syncMessage}
        </div>
      )}
    </div>
  );
};

export default OfflineSyncManager;