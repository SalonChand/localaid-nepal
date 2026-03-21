import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMyRequests } from '../services/requestService';
import { getMyAssignedTasks } from '../services/taskService';
import ChatBox from '../components/chat/ChatBox';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const[dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (user?.role === 'citizen') {
          const response = await getMyRequests();
          setDashboardData(response.data || [ ]);
        } else if (user?.role === 'volunteer') {
          const response = await getMyAssignedTasks();
          setDashboardData(response.data || [ ]);
        } else {
          // Admins and Organizations don't fetch a standard list here yet
          setDashboardData([ ]);
        }
      } catch (err) {
        setError('Failed to load your dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleOpenChat = (item) => {
    const isVolunteer = user?.role === 'volunteer';
    const taskId = isVolunteer ? item.id : item.taskDetails?.id;
    const title = isVolunteer ? item.supportRequest?.title : item.title;
    if (taskId) setActiveChat({ taskId, title });
  };

  const renderCitizenCards = () => (
    <>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Request Assistance</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Submit a formal support request for emergency food supplies, medical aid, or temporary shelter.</p>
        </div>
        <button onClick={() => navigate('/create-request')} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm">Create Request</button>
      </div>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">NGO Directory</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Browse verified organizations and community groups actively providing relief across Nepal.</p>
        </div>
        <button onClick={() => navigate('/organizations')} className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-600 hover:text-indigo-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm">View Organizations</button>
      </div>
    </>
  );

  const renderVolunteerCards = () => (
    <>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Find New Tasks</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">View pending requests and accept tasks to provide direct aid.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm">Open Task Board</button>
      </div>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">My Active Missions</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Manage the support requests you have committed to fulfilling.</p>
        </div>
        <button onClick={() => navigate('/my-tasks')} className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm">View My Tasks</button>
      </div>
    </>
  );

  const renderOrganizationCards = () => (
    <>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Setup Profile</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Register your NGO's official details.</p>
        </div>
        <button onClick={() => navigate('/register-organization')} className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-600 hover:text-indigo-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm">Add NGO Details</button>
      </div>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Host a Campaign</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Create public events such as blood donation drives.</p>
        </div>
        <button onClick={() => navigate('/create-event')} className="w-full bg-slate-900 hover:bg-amber-500 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm">Create Event</button>
      </div>
      <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Community Tasks</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">Monitor community requests and dispatch volunteers.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="w-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm">View Task Board</button>
      </div>
    </>
  );

  // --- NEW: ADMIN CARDS ---
  const renderAdminCards = () => (
    <div className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:border-rose-300 transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-1">
      <div>
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Security & Verification</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">Review and approve pending NGO registrations to ensure community safety.</p>
      </div>
      <button onClick={() => navigate('/admin')} className="w-full bg-slate-900 hover:bg-rose-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm">
        Go to Admin Panel
      </button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Premium Welcome Banner */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800">
          <div className="relative z-10">
            <h2 className="text-3xl font-light text-slate-300 mb-2">Welcome back, <span className="font-semibold text-white">{user?.name}</span></h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              {user?.role === 'admin' ? 'Oversee platform security and manage verified organizations from your command center.' : 
               user?.role === 'volunteer' ? 'Thank you for stepping up to help your community. Check your active missions below.' : 
               user?.role === 'organization' ? 'Manage your community campaigns from your command center.' : 
               'Manage your community requests and track assistance from your central command center.'}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                user?.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                user?.role === 'volunteer' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                user?.role === 'organization' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {user?.role}
              </span>
              <span className="text-slate-400 text-sm font-medium">{user?.email}</span>
            </div>
          </div>
          <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none ${
             user?.role === 'admin' ? 'bg-rose-600' :
             user?.role === 'volunteer' ? 'bg-emerald-600' : 
             user?.role === 'organization' ? 'bg-amber-500' : 'bg-indigo-600'
          }`}></div>
        </div>

        {/* Dynamic Action Cards Grid */}
        <div className={`grid grid-cols-1 gap-6 ${user?.role === 'organization' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {user?.role === 'citizen' && renderCitizenCards()}
          {user?.role === 'volunteer' && renderVolunteerCards()}
          {user?.role === 'organization' && renderOrganizationCards()}
          {user?.role === 'admin' && renderAdminCards()}
        </div>

        {/* Dynamic List Section - HIDDEN FOR ADMIN */}
        {user?.role !== 'admin' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <span className={`w-2 h-6 rounded-full ${user?.role === 'volunteer' ? 'bg-emerald-600' : user?.role === 'organization' ? 'bg-amber-500' : 'bg-indigo-600'}`}></span>
              {user?.role === 'volunteer' ? 'My Recent Assignments' : user?.role === 'organization' ? 'Our Active Campaigns' : 'My Recent Requests'}
            </h3>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-slate-100 rounded-2xl w-full"></div>
                <div className="h-24 bg-slate-100 rounded-2xl w-full"></div>
              </div>
            ) : error ? (
              <p className="text-rose-500 font-medium">{error}</p>
            ) : dashboardData.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500 font-medium">No items found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.map((item) => {
                  const isVolunteer = user?.role === 'volunteer';
                  const displayData = isVolunteer ? item.supportRequest : item;
                  const hasTaskAssigned = isVolunteer ? true : !!item.taskDetails;
                  
                  return (
                    <div key={item.id} className="group border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-colors duration-300 bg-white flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-800 mb-1">{displayData?.title || 'Unknown'}</h4>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{displayData?.description || ''}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md tracking-wide">
                            {displayData?.category || 'General'}
                          </span>
                          <span className="text-slate-400 font-medium flex items-center gap-1 ml-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {displayData?.location || 'Unknown Location'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start lg:items-end border-t lg:border-t-0 pt-4 lg:pt-0 gap-3 min-w-[150px]">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          (item.status === 'In-Progress' || item.status === 'Assigned') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {item.status}
                        </span>
                        
                        {hasTaskAssigned && item.status !== 'Completed' && (
                          <button
                            onClick={() => handleOpenChat(item)}
                            className="w-full mt-2 bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Open Chat
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {activeChat && (
        <ChatBox 
          taskId={activeChat.taskId} 
          taskTitle={activeChat.title} 
          currentUser={user} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;