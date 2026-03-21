import React, { useState, useEffect, useRef } from 'react';
import { getMyNotifications, markAsRead } from '../../services/notificationService';

const NotificationBell = () => {
  const[notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getMyNotifications();
        setNotifications(response.data ||[]);
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    };

    // Fetch immediately on load
    fetchNotifications();
    
    // Optional: Set up a timer to check for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  },[]);

  // Close the dropdown if the user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  },[]);

  const handleNotificationClick = async (id, isRead) => {
    if (!isRead) {
      try {
        await markAsRead(id);
        // Update the local state so the red dot disappears instantly
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
      } catch (err) {
        console.error('Failed to mark as read');
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* The Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* The Red Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 border-2 border-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* The Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                You have no notifications.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="w-2 h-2 mt-1.5 bg-indigo-600 rounded-full shrink-0"></span>
                      )}
                    </div>
                    <p className={`text-xs ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'} line-clamp-2 leading-relaxed`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;