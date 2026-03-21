import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '../services/eventService';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    organizationId: 1 
  });
  const [error, setError] = useState('');
  const[isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createEvent(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Host a Campaign
            </h2>
            <p className="text-sm text-slate-500 mt-1">Schedule a public relief event or volunteer drive.</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg">
            Cancel
          </Link>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Campaign Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Mega Blood Donation Drive 2026"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Description</label>
            <textarea
              name="description"
              required
              rows="4"
              placeholder="Provide details about the event, what volunteers need to bring, and who it benefits."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900 resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Volunteer Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g., 50"
                min="1"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Location</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g., Tundikhel Ground, Kathmandu"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-slate-900"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-amber-500 transition-all duration-300 shadow-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Publishing Event...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;