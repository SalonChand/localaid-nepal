import React from 'react';

/**
 * Full-width app-style button, matching the original LocalAid look
 * (slate-900 base that turns indigo on press). Light mode only.
 * variant: 'primary' (slate-900 -> indigo) | 'secondary' (outlined)
 */
const Button = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary:
      'bg-slate-900 text-white active:bg-indigo-600 shadow-sm disabled:opacity-70',
    secondary:
      'bg-white text-slate-700 border border-slate-200 active:bg-slate-50',
  };

  return (
    <button
      className={`w-full font-semibold py-3.5 px-4 rounded-xl text-[16px]
        transition-all duration-300 active:scale-[0.99]
        disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
};

export default Button;
