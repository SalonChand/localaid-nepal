import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPendingOrganizations, verifyOrganization } from '../services/adminService';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const[pendingOrgs, setPendingOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    // Extra security check just for the frontend
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchPending = async () => {
      try {
        const response = await getPendingOrganizations();
        setPendingOrgs(response.data ||[]);
      } catch (err) {
        setError('Failed to load pending organizations.');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [user, navigate]);

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await verifyOrganization(id);
      // Remove the verified organization from the pending list
      setPendingOrgs(pendingOrgs.filter(org => org.id !== id));
    } catch (err) {
      alert('Failed to verify organization.');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
              System Administrator
            </div>
            <h1 className="text-3xl font-light text-white tracking-tight">
              Security & Verification Center
            </h1>
            <p className="text-slate-400 mt-2">Review and approve NGO registrations to ensure community safety.</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-center min-w-[150px]">
            <span className="block text-3xl font-bold text-white">{pendingOrgs.length}</span>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Pending Review</span>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md font-medium">
            {error}
          </div>
        )}

        {/* Pending Organizations List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
            Action Required: Pending Approvals
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
              <div className="h-32 bg-slate-100 rounded-2xl w-full"></div>
            </div>
          ) : pendingOrgs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900">All caught up.</h3>
              <p className="mt-1 text-sm text-slate-500">There are no organizations waiting for verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrgs.map((org) => (
                <div key={org.id} className="border border-slate-200 rounded-2xl p-6 bg-white hover:border-slate-300 transition-colors flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{org.name}</h3>
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                        Unverified
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4">{org.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Reg No: {org.registrationNumber || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {org.address}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {org.contactEmail}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {org.phone}
                      </div>
                    </div>
                  </div>

                  <div className="border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-100 flex flex-col gap-3 min-w-[180px]">
                    <button
                      onClick={() => handleVerify(org.id)}
                      disabled={verifyingId === org.id}
                      className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                        verifyingId === org.id 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {verifyingId === org.id ? 'Verifying...' : 'Approve & Verify'}
                    </button>
                    <p className="text-xs text-center text-slate-400 font-medium">
                      Requested {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;