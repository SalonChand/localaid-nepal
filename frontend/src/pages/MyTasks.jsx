import React, { useEffect, useState, useContext } from 'react';
import { getMyAssignedTasks, updateTaskStatus } from '../services/taskService';
import { AuthContext } from '../context/AuthContext';
import ChatBox from '../components/chat/ChatBox';

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State to control which chat box is open
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const response = await getMyAssignedTasks();
        setTasks(response.data ||[]);
      } catch (err) {
        setError('Failed to load your tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  },[]);

  const handleComplete = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'Completed');
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'Completed' } : task
      ));
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Assigned Tasks</h1>
          <p className="mt-2 text-sm text-slate-500">Manage the support requests you have committed to fulfilling.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-24 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">No active tasks</h3>
            <p className="mt-1 text-sm text-slate-500">You have not accepted any volunteer tasks yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      Assigned on {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {task.supportRequest?.title || 'Unknown Request'}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {task.supportRequest?.description || 'No description available.'}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg inline-flex">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {task.supportRequest?.location || 'Unknown Location'}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[160px]">
                  
                  {/* CHAT BUTTON */}
                  <button
                    onClick={() => setActiveChat(task)}
                    className="w-full bg-white border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 py-2.5 px-4 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Open Chat
                  </button>

                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark Complete
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* RENDER THE CHAT BOX IF ONE IS ACTIVE */}
      {activeChat && (
        <ChatBox 
          taskId={activeChat.taskId || activeChat.id} 
          taskTitle={activeChat.supportRequest?.title} 
          currentUser={user} 
          onClose={() => setActiveChat(null)} 
        />
      )}

    </div>
  );
};

export default MyTasks;