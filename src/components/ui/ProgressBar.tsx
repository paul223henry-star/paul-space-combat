'use client';

import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  variant?: 'blue' | 'cyan' | 'red' | 'green' | 'amber' | 'purple';
  showValueText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  variant = 'blue',
  showValueText = true,
  className = '',
}) => {
  const percentage = Math.max(0, Math.min(100, (value / (max || 1)) * 100));

  const variantColors = {
    blue: 'bg-blue-500 shadow-blue-500/50',
    cyan: 'bg-cyan-400 shadow-cyan-400/50',
    red: 'bg-red-500 shadow-red-500/50',
    green: 'bg-emerald-500 shadow-emerald-500/50',
    amber: 'bg-amber-400 shadow-amber-400/50',
    purple: 'bg-purple-500 shadow-purple-500/50',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValueText) && (
        <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-1 font-mono">
          {label && <span className="text-slate-400 font-bold">{label}</span>}
          {showValueText && (
            <span className="text-slate-200">
              {Math.ceil(value)} / {max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-900/80 border border-slate-700/60 rounded-full h-3.5 p-0.5 overflow-hidden backdrop-blur-sm">
        <div
          className={`h-full rounded-full transition-all duration-150 shadow-sm ${variantColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
