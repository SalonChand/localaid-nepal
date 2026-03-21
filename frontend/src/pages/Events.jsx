import React, { useEffect, useState } from 'react';
import { getUpcomingEvents } from '../services/eventService';

const Events = () => {
  const[events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const[error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getUpcomingEvents();
        setEvents(response.data ||[]);
      } catch (err) {
        setError('Failed to load upcoming events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  },[]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Community Events</h1>
          <p className="mt-2 text-sm text-slate-500">Discover upcoming relief campaigns, blood donation drives, and volunteer meetups across Nepal.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-3xl p-6 border border-slate-200 h-64"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No upcoming events</h3>
            <p className="mt-1 text-sm text-slate-500">There are no campaigns scheduled at this time. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div key={event.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col">
                  {/* Date Banner */}
                  <div className="bg-amber-500 text-white text-center py-3 border-b border-amber-600">
                    <span className="block text-2xl font-black uppercase tracking-widest leading-none">
                      {eventDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="block text-xs font-semibold mt-1 opacity-90">
                      {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{event.title}</h3>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Capacity: {event.capacity ? `${event.capacity} Volunteers` : 'Unlimited'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;