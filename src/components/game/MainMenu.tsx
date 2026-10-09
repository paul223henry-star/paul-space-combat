'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { PlayerData } from '../../game/types/game';
import { Play, HelpCircle, Settings, Trophy, ShieldAlert } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface MainMenuProps {
  playerData: PlayerData;
  onPlayClick: () => void;
  onHowToPlayClick: () => void;
  onSettingsClick: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  playerData,
  onPlayClick,
  onHowToPlayClick,
  onSettingsClick,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Subtitle / Brand header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>BRAND: PAUL • V1.0</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] font-mono">
          PAUL SPACE COMBAT
        </h1>

        <p className="mt-2 text-sm text-slate-400 font-medium">
          Move fast. Shoot accurately. Defend the sector.
        </p>

        {/* Central Spaceship Animated Preview */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          <svg
            className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-bounce-short"
            viewBox="0 0 48 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Plasma exhaust trail */}
            <path
              d="M21 44 L24 53 L27 44 Z"
              fill="#38bdf8"
              className="animate-pulse"
            />
            {/* Main fuselage */}
            <path
              d="M24 2 L38 34 L30 42 L24 38 L18 42 L10 34 Z"
              fill="#1e40af"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />
            {/* Cockpit canopy */}
            <polygon
              points="24,10 27,24 24,28 21,24"
              fill="#22d3ee"
            />
            {/* Wing cannons */}
            <line x1="12" y1="28" x2="12" y2="18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="36" y1="28" x2="36" y2="18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* High Score Banner */}
        <div className="my-4 px-6 py-2.5 w-full bg-slate-900/80 border border-blue-500/20 rounded-xl flex items-center justify-between font-mono">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <Trophy className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider text-slate-400">HIGH SCORE</span>
          </div>
          <span className="text-lg font-bold text-white">
            {formatNumber(playerData.highScore)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            icon={<Play className="w-5 h-5 fill-white" />}
            onClick={onPlayClick}
            className="w-full text-base py-4 bg-blue-600 hover:bg-blue-500 shadow-blue-500/50"
          >
            START GAME
          </Button>

          {/* Quick Controls Info Panel */}
          <div className="px-3 py-2 bg-slate-900/60 border border-blue-500/20 rounded-lg flex items-center justify-around text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 font-bold rounded text-[10px]">↑ ↓ ← →</span>
              <span>Move</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-blue-300 font-bold rounded text-[10px]">SPACE</span>
              <span>Shoot</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 font-bold rounded text-[10px]">P</span>
              <span>Pause</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={<HelpCircle className="w-4 h-4" />}
              onClick={onHowToPlayClick}
              className="w-full text-xs"
            >
              HOW TO PLAY
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={<Settings className="w-4 h-4" />}
              onClick={onSettingsClick}
              className="w-full text-xs"
            >
              SETTINGS
            </Button>
          </div>
        </div>

        {/* Quick Statistics Summary */}
        <div className="mt-8 grid grid-cols-3 gap-2 w-full text-center font-mono text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
          <div>
            <div className="text-slate-500 uppercase">BEST WAVE</div>
            <div className="text-slate-200 font-bold mt-0.5">WAVE {playerData.bestWave}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">KILLS</div>
            <div className="text-slate-200 font-bold mt-0.5">{formatNumber(playerData.totalEnemiesDestroyed)}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase">GAMES</div>
            <div className="text-slate-200 font-bold mt-0.5">{playerData.totalGamesPlayed}</div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="mt-6 text-[11px] font-mono text-slate-500 tracking-wider">
          SPACE COMBAT V1.0 • PAUL OYELEYE
        </div>
      </div>
    </div>
  );
};
