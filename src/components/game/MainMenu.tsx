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
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PROJECT BY PAUL OYELEYE</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] font-mono">
          SPACE COMBAT
        </h1>

        <p className="mt-2 text-sm text-slate-400 font-medium">
          Move fast. Shoot accurately. Survive the waves.
        </p>

        {/* High Score Banner */}
        <div className="my-6 px-6 py-3 w-full bg-slate-900/80 border border-blue-500/20 rounded-xl flex items-center justify-between font-mono">
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
            className="w-full text-base py-4 shadow-blue-500/40"
          >
            LAUNCH MISSION
          </Button>

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
