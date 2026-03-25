import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createSupportRequest } from '../services/requestService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position}></Marker>;
};

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'General', urgency: 'Medium', location: '', contactPhone: '',
    availableDate: '', bloodType: ''
  });
  
  const[position, setPosition] = useState({ lat: 27.7172, lng: 85.3240 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // NEW STATE FOR VOICE AI
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'category' && e.target.value !== 'Blood') {
      setFormData({ ...formData, category: e.target.value, bloodType: '' });
    } else {
      setFormData({ ...formData,[e.target.name]: e.target.value });
    }
  };

  // --- VOICE TO TEXT AI LOGIC ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Voice-to-Text dictation.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Can be changed to 'ne-NP' for Nepali!
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Append the spoken words to whatever is already typed in the description box
      setFormData((prev) => ({
        ...prev,
        description: prev.description ? `${prev.description} ${transcript}` : transcript
      }));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const requestPayload = {
      ...formData,
      latitude: position.lat,
      longitude: position.lng
    };

    try {
      if (!navigator.onLine) {
        const { saveOfflineRequest } = await import('../services/offlineSyncService');
        saveOfflineRequest(requestPayload);
        alert("⚠️ You are offline. Your request has been saved to your device and will be sent automatically when internet returns.");
        navigate('/dashboard');
        return;
      }

      await createSupportRequest(requestPayload);
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        const { saveOfflineRequest } = await import('../services/offlineSyncService');
        saveOfflineRequest(requestPayload);
        alert("⚠️ Network connection failed. Your request is saved offline.");
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Failed to submit request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Request Assistance</h2>
            <p className="text-sm text-slate-500 mt-1">Submit a detailed request and drop a pin to get precise help.</p>
          </div>
          <Link to="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg">Cancel</Link>
        </div>
        
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-900 mb-1">Pinpoint Exact Location</label>
            <p className="text-xs text-slate-500 mb-3 font-medium">Click or tap anywhere on the map to place your rescue pin.</p>
            <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm relative z-0">
              <MapContainer center={[27.7172, 85.3240]} zoom={13} className="h-full w-full z-0" scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Request Title</label>
            <input type="text" name="title" required placeholder="e.g., Urgent O- Blood Required" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900" value={formData.title} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">General Area</label>
              <input type="text" name="location" required placeholder="e.g., Bir Hospital, Kathmandu" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900" value={formData.location} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number (For SMS Alerts)</label>
              <input type="tel" name="contactPhone" required placeholder="e.g., 9840000000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900" value={formData.contactPhone} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <select name="category" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 cursor-pointer" value={formData.category} onChange={handleChange}>
                <option value="Food">Food & Water</option>
                <option value="Medical">Medical Assistance</option>
                <option value="Blood">Blood Donation (Urgent)</option>
                <option value="Shelter">Shelter & Clothing</option>
                <option value="Rescue">Emergency Rescue</option>
                <option value="General">General Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urgency Level</label>
              <select name="urgency" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 cursor-pointer" value={formData.urgency} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${formData.category === 'Blood' ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-5`}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Needed By Date (Optional)</label>
              <input type="date" name="availableDate" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900" value={formData.availableDate} onChange={handleChange} />
            </div>

            {formData.category === 'Blood' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-rose-600 mb-1.5">Required Blood Type</label>
                <select name="bloodType" required className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 outline-none text-slate-900 font-bold cursor-pointer" value={formData.bloodType} onChange={handleChange}>
                  <option value="" disabled>Select Blood Group...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Any">Any Type (Rare)</option>
                </select>
              </div>
            )}
          </div>

          {/* UPGRADED DESCRIPTION BOX WITH MICROPHONE BUTTON */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">Detailed Description</label>
              <button 
                type="button" 
                onClick={startListening}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {isListening ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    Listening...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Tap to Speak
                  </>
                )}
              </button>
            </div>
            <textarea 
              name="description" 
              required 
              rows="4" 
              placeholder="Type or use the microphone to describe exactly what you need..." 
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:outline-none transition-all resize-none ${
                isListening ? 'border-rose-300 ring-2 ring-rose-500/20 shadow-inner' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900'
              }`}
              value={formData.description} 
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className={`w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-indigo-600 transition-all shadow-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Submitting Request...' : 'Submit Support Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;