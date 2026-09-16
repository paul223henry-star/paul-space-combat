'use client';

import React from 'react';
import { BossPhase } from '../../game/types/game';

interface BossHealthBarProps {
  name: string;
  health: number;
  maxHealth: number;
  phase: BossPhase;
}

export const BossHealthBar: React.FC<BossHealthBarProps> = ({
  name,
  health,
  maxHealth,
  phase,
}) => {
  const percentage = Math.max(0, Math.min(100, (health / (maxHealth || 1)) * 100));

  const phaseColors: Record<BossPhase, { text: string; bar: string }> = {
    1: { text: 'text-blue-400', bar: 'bg-blue-500 shadow-blue-500/50' },
    2: { text: 'text-purple-400', bar: 'bg-purple-500 shadow-purple-500/50' },
    3: { text: 'text-amber-400', bar: 'bg-amber-500 shadow-amber-500/50' },
    4: { text: 'text-red-500 animate-pulse', bar: 'bg-red-600 shadow-red-500/80' },
  };

  const { text, bar } = phaseColors[phase] || phaseColors[1];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 select-none animate-slide-down">
      <div className="flex items-center justify-between mb-1.5 font-mono text-xs md:text-sm">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-extrabold tracking-widest text-red-400">WARNING:</span>
          <span className="font-bold text-white tracking-wider uppercase">{name}</span>
        </div>
        <span className={`font-semibold tracking-wider ${text}`}>
          PHASE {phase} / 4
        </span>
      </div>

      <div className="w-full bg-black/80 border-2 border-red-500/40 rounded-md h-4 p-0.5 overflow-hidden backdrop-blur-md shadow-lg shadow-red-950/50">
        <div
          className={`h-full rounded-sm transition-all duration-100 ${bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
