'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { GameSession, PlayerData } from '../../game/types/game';
import { RotateCcw, Home, Trophy, Skull, Crosshair } from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface GameOverModalProps {
  session: GameSession;
  playerData: PlayerData;
  onRestartClick: () => void;
  onMainMenuClick: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  session,
  playerData,
  onRestartClick,
  onMainMenuClick,
}) => {
  const isNewHighScore = session.score > 0 && session.score >= playerData.highScore;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="w-full max-w-md bg-slate-950/95 border-2 border-red-500/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-red-950/60 text-center relative overflow-hidden">
        {/* Danger line accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-3">
          <Skull className="w-6 h-6" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black font-mono tracking-widest text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          VESSEL DESTROYED
        </h2>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
          TACTICAL COMBAT DEBRIEF
        </p>

        {/* New High Score Banner */}
        {isNewHighScore && (
          <div className="my-4 py-2 px-4 bg-amber-500/20 border border-amber-400/50 rounded-lg flex items-center justify-center gap-2 text-amber-300 font-mono text-xs font-bold animate-bounce-short">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>NEW HIGH SCORE ACHIEVED!</span>
          </div>
        )}

        {/* Mission Stats Grid */}
        <div className="my-5 grid grid-cols-2 gap-3 font-mono">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-left">
            <div className="text-[10px] uppercase text-slate-500">FINAL SCORE</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {formatNumber(session.score)}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-left">
            <div className="text-[10px] uppercase text-slate-500">SECTOR REACHED</div>
            <div className="text-xl font-bold text-cyan-300 mt-0.5">
              WAVE {session.wave}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-left">
            <div className="text-[10px] uppercase text-slate-500 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-red-400" />
              <span>HOSTILES KILLED</span>
            </div>
            <div className="text-xl font-bold text-slate-200 mt-0.5">
              {session.enemiesDestroyed}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-left">
            <div className="text-[10px] uppercase text-slate-500 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>ALL-TIME BEST</span>
            </div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {formatNumber(Math.max(playerData.highScore, session.score))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button
            variant="primary"
            size="lg"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRestartClick}
            className="w-full bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-blue-500/40"
          >
            PLAY AGAIN [R]
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={<Home className="w-4 h-4" />}
            onClick={onMainMenuClick}
            className="w-full text-slate-400 hover:text-white"
          >
            MAIN MENU
          </Button>
        </div>
      </div>
    </div>
  );
};
