'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';

interface PauseMenuProps {
  onResumeClick: () => void;
  onRestartClick: () => void;
  onSettingsClick: () => void;
  onMainMenuClick: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResumeClick,
  onRestartClick,
  onSettingsClick,
  onMainMenuClick,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="w-full max-w-sm bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 shadow-2xl shadow-blue-500/20 text-center">
        <h2 className="text-2xl md:text-3xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          MISSION PAUSED
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1 mb-6">
          Press [P] or click Resume to continue
        </p>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="md"
            icon={<Play className="w-4 h-4 fill-white" />}
            onClick={onResumeClick}
            className="w-full"
          >
            RESUME MISSION
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRestartClick}
            className="w-full"
          >
            RESTART WAVE
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<Settings className="w-4 h-4" />}
            onClick={onSettingsClick}
            className="w-full"
          >
            SETTINGS
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
