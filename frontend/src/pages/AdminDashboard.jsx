import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  getPendingOrganizations, 
  verifyOrganization, 
  getSystemStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} from '../services/adminService';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState('ngos'); // 'ngos' or 'users'
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Formatted carefully to avoid build bugs
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const[orgsRes, statsRes, usersRes] = await Promise.all([
          getPendingOrganizations(),
          getSystemStats(),
          getAllUsers()
        ]);
        
        setPendingOrgs(orgsRes.data ||[]);
        setStats(statsRes.data);
        setUsers(usersRes.data ||[]);
      } catch (err) {
        setError('Failed to load administrative data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  // --- HANDLERS ---
  const handleVerify = async (id) => {
    setProcessingId(id);
    try {
      await verifyOrganization(id);
      setPendingOrgs(pendingOrgs.filter(org => org.id !== id));
      // Optionally update stats
      if (stats) setStats({ ...stats, ngos: stats.ngos + 1 });
    } catch (err) {
      alert('Failed to verify organization.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (id === user.id) return alert("You cannot change your own role.");
    
    try {
      await updateUserRole(id, newRole);
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === user.id) return alert("You cannot delete your own account.");
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    setProcessingId(id);
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Secure Dashboard...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Admin Header & Analytics */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
                System Administrator
              </div>
              <h1 className="text-3xl font-light text-white tracking-tight">Security & Control Center</h1>
              <p className="text-slate-400 mt-2">Monitor platform metrics, manage users, and approve NGO registrations.</p>
            </div>
          </div>

          {/* Statistics Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                <p className="text-3xl font-black text-white">{stats.users.total}</p>
                <p className="text-xs text-indigo-300 mt-2">{stats.users.volunteers} Volunteers</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Requests</p>
                <p className="text-3xl font-black text-white">{stats.requests.total}</p>
                <p className="text-xs text-emerald-300 mt-2">{stats.requests.completed} Completed</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Verified NGOs</p>
                <p className="text-3xl font-black text-white">{stats.ngos}</p>
                <p className="text-xs text-amber-300 mt-2">{pendingOrgs.length} Pending</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Campaigns</p>
                <p className="text-3xl font-black text-white">{stats.events}</p>
                <p className="text-xs text-rose-300 mt-2">Active Events</p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md font-medium">{error}</div>}

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('ngos')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ngos' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pending NGOs ({pendingOrgs.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Manage Users
          </button>
        </div>

        {/* --- TAB CONTENT: PENDING NGOs --- */}
        {activeTab === 'ngos' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-2 h-6 bg-rose-500 rounded-full"></span> Action Required: NGO Approvals
            </h2>

            {pendingOrgs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
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
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Unverified</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{org.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-500 font-medium">
                        <div>Reg No: {org.registrationNumber || 'N/A'}</div>
                        <div>{org.address}</div>
                        <div>{org.contactEmail}</div>
                        <div>{org.phone}</div>
                      </div>
                    </div>
                    <div className="border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-slate-100 flex flex-col gap-3 min-w-[180px]">
                      <button
                        onClick={() => handleVerify(org.id)}
                        disabled={processingId === org.id}
                        className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${processingId === org.id ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                      >
                        {processingId === org.id ? 'Verifying...' : 'Approve NGO'}
                      </button>
                      <p className="text-xs text-center text-slate-400 font-medium">Requested {new Date(org.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: MANAGE USERS --- */}
        {activeTab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span> User Management
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-slate-200">Name & Email</th>
                    <th className="p-4 font-bold border-b border-slate-200">Registered</th>
                    <th className="p-4 font-bold border-b border-slate-200">Role</th>
                    <th className="p-4 font-bold border-b border-slate-200 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{u.name} {u.id === user.id && <span className="text-rose-500 text-xs ml-1">(You)</span>}</div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={u.id === user.id}
                          className={`text-sm font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
                            u.role === 'admin' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            u.role === 'organization' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            u.role === 'volunteer' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="citizen">Citizen</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="organization">Organization</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user.id || processingId === u.id}
                          className="text-rose-500 hover:text-white hover:bg-rose-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;