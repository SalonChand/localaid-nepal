import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrganization, getMyOrganization, updateOrganization } from '../services/orgService';

const CreateOrganization = () => {
  const[formData, setFormData] = useState({
    name: '', description: '', registrationNumber: '', contactEmail: '', phone: '', address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // On page load, check if the user already has an organization profile!
  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const response = await getMyOrganization();
        if (response.data) {
          // They have one! Fill the form with their data so they can edit it.
          setFormData(response.data);
          setIsEditing(true);
        }
      } catch (err) {
        console.log("No existing profile found, creating a new one.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExistingProfile();
  },[]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isEditing) {
        await updateOrganization(formData);
        setSuccess('Organization profile updated successfully!');
      } else {
        await createOrganization(formData);
        navigate('/organizations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save organization details. Check for duplicate names/emails.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              {isEditing ? 'Manage NGO Details' : 'Register NGO Details'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing ? 'Update your official organization profile below.' : 'Add your organization to the public verified directory.'}
            </p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg">
            Back
          </Link>
        </div>
        
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization Name</label>
            <input type="text" name="name" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mission / Description</label>
            <textarea name="description" required rows="3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 resize-none" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Govt. Registration No.</label>
              <input type="text" name="registrationNumber" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.registrationNumber} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
              <input type="text" name="phone" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Official Email</label>
              <input type="email" name="contactEmail" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Headquarters Address</label>
              <input type="text" name="address" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-600 transition-all duration-300 shadow-sm">
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Organization Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrganization;