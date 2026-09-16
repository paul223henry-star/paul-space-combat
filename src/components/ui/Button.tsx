'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded',
    md: 'px-5 py-2.5 text-sm rounded-md',
    lg: 'px-8 py-3.5 text-base rounded-lg tracking-widest',
  };

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/40 active:scale-95 focus:ring-blue-400',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600/60 shadow-md active:scale-95 focus:ring-slate-400',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-400/40 active:scale-95 focus:ring-red-400',
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-700 active:scale-95 focus:ring-slate-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
