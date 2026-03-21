import React, { useEffect, useState } from 'react';
import { getOrganizations } from '../services/orgService';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Formatted carefully to avoid the build bug
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await getOrganizations();
        setOrganizations(response.data || [ ]);
      } catch (err) {
        setError('Failed to load organizations.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  } , [ ] );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verified Organizations</h1>
          <p className="mt-2 text-sm text-slate-500">Discover and connect with active NGOs and community groups operating across Nepal.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-2xl p-6 border border-slate-200 h-48"></div>
            ))}
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">No organizations found</h3>
            <p className="mt-1 text-sm text-slate-500">There are currently no registered organizations in the network.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div key={org.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl border border-indigo-100">
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{org.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Reg: {org.registrationNumber || 'Pending'}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {org.description}
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{org.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{org.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{org.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;