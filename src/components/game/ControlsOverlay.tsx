'use client';

import React, { useState, useEffect } from 'react';

interface ControlsOverlayProps {
  onDismiss?: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto fade-out after 6 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, 6000);

    const handleKey = () => {
      // Fade out on user interaction
      const fadeTimer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 2000);
      return () => clearTimeout(fadeTimer);
    };

    window.addEventListener('keydown', handleKey, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-1000 select-none">
      <div className="flex items-center gap-6 px-6 py-3 bg-slate-950/85 border border-cyan-500/30 rounded-xl backdrop-blur-md shadow-xl shadow-cyan-950/40 text-xs md:text-sm font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-cyan-400 font-bold">
            ↑ ↓ ← →
          </span>
          <span className="tracking-wide">MOVE</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-blue-400 font-bold">
            SPACE
          </span>
          <span className="tracking-wide">SHOOT</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400 font-bold">
            P / ESC
          </span>
          <span className="tracking-wide">PAUSE</span>
        </div>
      </div>
    </div>
  );
};
