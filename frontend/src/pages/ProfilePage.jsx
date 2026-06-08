import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { LogOut, User, Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) delete dataToSubmit.password;

      await updateUserProfile(dataToSubmit);
      setMessage({
        type: 'success',
        text: 'Profile updated! If you changed your email or password, please sign in again.',
      });

      if (dataToSubmit.password) {
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 flex justify-center items-center font-semibold text-slate-500">
        Loading Profile…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50">
      {/* Profile header card */}
      <div className="px-5 pt-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3">
            {profileData?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{profileData?.name}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{profileData?.email}</p>
          <div className="inline-block mt-3 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-widest">
            {profileData?.role} Account
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="px-5 mt-5">
        {message.text && (
          <div
            className={`p-4 rounded-2xl text-sm font-medium mb-4 ${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide ml-1">
            Personal Information
          </p>
          <Input
            label="Full Name"
            icon={User}
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            icon={Mail}
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide ml-1 pt-2">
            Security
          </p>
          <Input
            label="New Password"
            icon={Lock}
            type="password"
            name="password"
            placeholder="Leave blank to keep current"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-xs text-slate-400 ml-1 -mt-1">
            Changing your password will sign you out.
          </p>

          <div className="pt-2">
            <Button type="submit" variant="primary" loading={updating}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Logout */}
      <div className="px-5 mt-6 mb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 font-semibold active:scale-[0.99] transition-transform"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
