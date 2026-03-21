import React, { useState } from 'react';

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Official Emergency Numbers for Nepal
  const emergencyContacts =[
    { name: 'Police Control', number: '100', color: 'bg-blue-600' },
    { name: 'Fire Brigade', number: '101', color: 'bg-orange-600' },
    { name: 'Ambulance', number: '102', color: 'bg-emerald-600' },
    { name: 'Traffic Police', number: '103', color: 'bg-slate-700' },
    { name: 'Child Helpline', number: '104', color: 'bg-indigo-500' },
    { name: 'Red Cross', number: '106', color: 'bg-rose-600' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-4 w-64 bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden origin-bottom-right transform transition-all duration-300">
          <div className="bg-rose-600 px-4 py-3 text-white text-center">
            <h3 className="font-bold text-lg tracking-wider uppercase">Emergency Dial</h3>
            <p className="text-xs text-rose-200 mt-0.5 font-medium">Tap to call instantly (Nepal Only)</p>
          </div>
          <div className="p-2 space-y-1 bg-slate-50 max-h-72 overflow-y-auto">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.name}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${contact.color} rounded-full flex items-center justify-center text-white shadow-sm`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-800">{contact.name}</span>
                </div>
                <span className="font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full text-sm group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  {contact.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group focus:outline-none"
      >
        <div className={`absolute inset-0 bg-rose-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity duration-300 ${!isOpen ? 'animate-pulse' : ''}`}></div>
        <div className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-transform duration-300 ${isOpen ? 'bg-slate-800 rotate-45' : 'bg-rose-600 hover:scale-105'}`}>
          {isOpen ? (
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <span className="text-white font-black text-xl tracking-tighter">SOS</span>
          )}
        </div>
      </button>

    </div>
  );
};

export default SOSButton;