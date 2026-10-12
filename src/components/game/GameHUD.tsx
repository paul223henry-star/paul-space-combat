'use client';

import React from 'react';
import { GameSession } from '../../game/types/game';
import { ProgressBar } from '../ui/ProgressBar';
import { BossHealthBar } from './BossHealthBar';
import { Pause, Shield, Zap, Heart, Flame } from 'lucide-react';
import { POWER_UP_CONFIGS } from '../../game/config/powerups';
import { formatNumber } from '../../lib/utils';

interface GameHUDProps {
  session: GameSession;
  onPauseClick: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ session, onPauseClick }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none z-10">
      {/* Top Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Left: Brand & Score */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400/80 tracking-wider">
            <span className="font-bold text-blue-400">PAUL SPACE COMBAT</span>
          </div>

          <div className="mt-1">
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              SCORE
            </div>
            <div className="text-2xl md:text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200 tracking-tight drop-shadow-md">
              {formatNumber(session.score)}
            </div>
          </div>
        </div>

        {/* Center: Boss Bar if active */}
        {session.bossActive && (
          <div className="flex-1 max-w-xl mx-4">
            <BossHealthBar
              name={session.bossName}
              health={session.bossHealth}
              maxHealth={session.bossMaxHealth}
              phase={session.bossPhase}
            />
          </div>
        )}

        {/* Right: Wave, Combo & Controls */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Combo Multiplier Indicator */}
          {session.combo > 1 && (
            <div className="flex flex-col items-end animate-bounce-short">
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-lg text-amber-300 font-mono font-bold text-xs shadow-lg shadow-amber-500/10">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>COMBO x{session.combo}</span>
              </div>
              {/* Combo timeout bar */}
              <div className="w-20 bg-slate-900 border border-amber-500/30 rounded-full h-1 mt-1 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-75"
                  style={{ width: `${session.comboTimerPct * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Wave Badge */}
          <div className="px-3 py-1.5 bg-slate-950/80 border border-blue-500/30 rounded-lg backdrop-blur-sm text-center font-mono">
            <div className="text-[9px] uppercase tracking-widest text-slate-400">WAVE</div>
            <div className="text-sm md:text-base font-bold text-cyan-300">
              {String(session.wave).padStart(2, '0')}
            </div>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPauseClick}
            className="p-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-700/60 hover:border-blue-400 rounded-lg backdrop-blur-sm text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Bar: Telemetry & Active Buffs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 mb-2 md:mb-0">
        {/* Health and Shield Bars */}
        <div className="w-full max-w-[200px] sm:max-w-xs md:max-w-sm flex flex-col gap-1.5 md:gap-2 bg-slate-950/70 border border-slate-800/80 p-2.5 md:p-3 rounded-xl backdrop-blur-md shadow-xl">
          {/* Hull Health */}
          <ProgressBar
            label="HULL HP"
            value={session.playerHealth}
            max={session.playerMaxHealth}
            variant={session.playerHealth > 30 ? 'green' : 'red'}
            showValueText={true}
          />

          {/* Shield Energy */}
          <ProgressBar
            label="SHIELD MATRIX"
            value={session.playerShield}
            max={session.playerMaxShield}
            variant="cyan"
            showValueText={true}
          />
        </div>

        {/* Active Power-Ups List */}
        {session.activePowerUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 justify-start md:justify-end max-w-[calc(100%-6rem)] md:max-w-none">
            {session.activePowerUps.map((item) => {
              const conf = POWER_UP_CONFIGS[item.type];
              const pct = item.duration > 0 ? (item.remainingTime / item.duration) * 100 : 100;
              return (
                <div
                  key={item.type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg backdrop-blur-sm font-mono text-xs shadow-md"
                >
                  <span className="text-sm">{conf.symbol}</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">{conf.name}</span>
                    <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-100"
                        style={{ width: `${pct}%`, backgroundColor: conf.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
