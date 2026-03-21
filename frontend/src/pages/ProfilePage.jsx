import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Formatted to avoid build bugs
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfileData(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '',
        });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  } , [ ] );

  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      // Only send password if it was typed
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      await updateUserProfile(dataToSubmit);
      setMessage({ type: 'success', text: 'Profile updated successfully! If you changed your email/password, please sign in again.' });
      
      // If password changed, force logout for security
      if (dataToSubmit.password) {
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex justify-center items-center font-semibold text-slate-500">Loading Profile...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your personal information and security preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-inner border-4 border-slate-800">
              {profileData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left mt-2">
              <h2 className="text-2xl font-bold text-white">{profileData?.name}</h2>
              <p className="text-indigo-300 font-medium mt-1">{profileData?.email}</p>
              <div className="inline-block mt-3 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">
                {profileData?.role} Account
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium mb-8 ${message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" name="name" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" name="email" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mt-10 mb-4">Security</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                <input type="password" name="password" placeholder="Leave blank to keep current password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.password} onChange={handleChange} />
                <p className="text-xs text-slate-500 mt-2">If you change your password, you will be required to sign in again.</p>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" disabled={updating} className={`bg-indigo-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-sm ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {updating ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;