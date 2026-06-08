import React from 'react';

/**
 * Clean, iOS-settings-style text field. Light/dark aware.
 * Props: label, icon (lucide component), and any standard <input> props.
 */
const Input = React.forwardRef(({ label, icon: Icon, className = '', ...props }, ref) => {
  return (
    <label className="block">
      {label && (
        <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Icon size={18} strokeWidth={2} />
          </span>
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 rounded-2xl
            bg-slate-100 dark:bg-slate-800
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            border border-transparent
            focus:bg-white dark:focus:bg-slate-900
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
            outline-none transition-all text-[16px] ${className}`}
          {...props}
        />
      </div>
    </label>
  );
});

Input.displayName = 'Input';
export default Input;
