import React from 'react';

/**
 * Clean mobile text field, matching the original LocalAid palette
 * (slate-50 fields, indigo focus). Light mode only.
 * Props: label, icon (lucide component), and any standard <input> props.
 */
const Input = React.forwardRef(({ label, icon: Icon, className = '', ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl
            bg-slate-50 text-slate-900 placeholder-slate-400
            border border-slate-200
            focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
            outline-none transition-all text-[16px] ${className}`}
          {...props}
        />
      </div>
    </label>
  );
});

Input.displayName = 'Input';
export default Input;
