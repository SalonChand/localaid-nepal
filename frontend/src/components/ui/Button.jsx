import React from 'react';

/**
 * Full-width app-style button.
 * variant: 'primary' (indigo) | 'secondary' (outlined) | 'dark'
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
      'bg-indigo-600 text-white active:bg-indigo-700 disabled:opacity-60',
    dark:
      'bg-slate-900 dark:bg-white text-white dark:text-slate-900 active:opacity-90 disabled:opacity-60',
    secondary:
      'bg-transparent text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 active:bg-slate-100 dark:active:bg-slate-800',
  };

  return (
    <button
      className={`w-full font-semibold py-3.5 px-4 rounded-2xl text-[16px]
        transition-all active:scale-[0.99]
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
