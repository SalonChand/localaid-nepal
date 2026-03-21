import React, { useEffect, useState } from 'react';
import { getAvailableTasks, acceptTask } from '../services/taskService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for React-Leaflet missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const AvailableTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); 

  // --- FILTER STATES ---
  const[searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const[urgencyFilter, setUrgencyFilter] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAvailableTasks();
        
        const tasksWithCoords = (response.data ||[]).map((task) => {
          return {
            ...task,
            lat: task.latitude || 27.7172 + (Math.random() - 0.5) * 0.05,
            lng: task.longitude || 85.3240 + (Math.random() - 0.5) * 0.05
          };
        });
        
        setTasks(tasksWithCoords);
      } catch (err) {
        setError('Failed to load available tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  },[]); 

  const handleAccept = async (requestId) => {
    setAcceptingId(requestId);
    setError('');
    
    try {
      await acceptTask(requestId);
      setTasks(tasks.filter(task => task.id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept task.');
    } finally {
      setAcceptingId(null);
    }
  };

  // --- SMART FILTER LOGIC ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || task.urgency === urgencyFilter;

    return matchesSearch && matchesCategory && matchesUrgency;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Available Tasks</h1>
            <p className="mt-2 text-sm text-slate-500">Find citizens in your area who need assistance.</p>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Live Map
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center z-10 relative">
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or location (e.g., Lalitpur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 text-slate-900 transition-colors outline-none"
            />
          </div>

          <div className="w-full md:w-48 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 text-slate-900 appearance-none outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food & Water</option>
              <option value="Medical">Medical Assistance</option>
              <option value="Shelter">Shelter & Clothing</option>
              <option value="Rescue">Emergency Rescue</option>
              <option value="General">General Support</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="w-full md:w-48 relative">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 text-slate-900 appearance-none outline-none cursor-pointer"
            >
              <option value="All">All Urgencies</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-3xl p-6 border border-slate-200 h-64"></div>
            ))}
          </div>
        ) : viewMode === 'map' ? (
          
          /* --- MAP VIEW (ALWAYS SHOWS WHEN BUTTON IS CLICKED) --- */
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
            <MapContainer 
              center={[27.7172, 85.3240]} 
              zoom={13} 
              scrollWheelZoom={true} 
              className="h-[600px] w-full rounded-2xl z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Only render pins for tasks that match the filters! */}
              {filteredTasks.map(task => (
                <Marker key={task.id} position={[task.lat, task.lng]}>
                  <Popup className="rounded-xl shadow-lg">
                    <div className="p-2 min-w-[220px]">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 border ${
                        task.urgency === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                        task.urgency === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {task.urgency} Priority
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{task.title}</h3>
                      <p className="text-xs font-semibold text-indigo-600 mb-1">{task.category}</p>
                      <p className="text-xs text-slate-500 mb-4 border-b border-slate-100 pb-3">{task.location}</p>
                      <button
                        onClick={() => handleAccept(task.id)}
                        disabled={acceptingId === task.id}
                        className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        {acceptingId === task.id ? 'Accepting...' : 'Accept Task'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        ) : tasks.length === 0 ? (
          
          /* --- GRID VIEW: DATABASE EMPTY --- */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">All caught up.</h3>
            <p className="mt-1 text-sm text-slate-500">There are no pending requests in the network at this time.</p>
          </div>

        ) : filteredTasks.length === 0 ? (

          /* --- GRID VIEW: FILTERS NO MATCH --- */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No matching tasks</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search query to find more requests.</p>
            <button 
              onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setUrgencyFilter('All'); }}
              className="mt-4 text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>

        ) : (
          
          /* --- GRID VIEW: SHOW TASKS --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
                      {task.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold tracking-wide ${
                      task.urgency === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      task.urgency === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {task.urgency} Urgency
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{task.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{task.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl mb-6">
                    <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{task.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAccept(task.id)}
                  disabled={acceptingId === task.id}
                  className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
                    acceptingId === task.id 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {acceptingId === task.id ? (
                    'Accepting...'
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Accept Task
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableTasks;