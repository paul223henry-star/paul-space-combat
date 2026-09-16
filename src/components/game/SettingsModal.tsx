'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { GameSettings } from '../../game/types/game';
import { Volume2, VolumeX, Sparkles, Vibrate, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const update = (partial: Partial<GameSettings>) => {
    onSettingsChange({
      ...settings,
      ...partial,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AUDIO & SYSTEM SETTINGS">
      <div className="flex flex-col gap-6 text-slate-300 font-mono text-xs select-none">
        {/* Audio Section */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
              <Sliders className="w-4 h-4" />
              <span>AUDIO CONTROLS</span>
            </div>

            <button
              onClick={() => update({ muted: !settings.muted })}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                settings.muted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              }`}
            >
              {settings.muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ENABLED</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">MASTER VOLUME</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={settings.muted}
                value={settings.masterVolume}
                onChange={(e) => update({ masterVolume: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">SFX / WEAPONS VOLUME</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={settings.muted}
                value={settings.sfxVolume}
                onChange={(e) => update({ sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>

            {/* Music Volume */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">SYNTH SOUNDTRACK VOLUME</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round(settings.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={settings.muted}
                value={settings.musicVolume}
                onChange={(e) => update({ musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Visual FX Section */}
        <div>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-4 text-sm font-bold text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>VISUAL EFFECTS</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Screen Shake */}
            <label className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-white">SCREEN SHAKE DYNAMICS</div>
                  <div className="text-[10px] text-slate-500">
                    Impact camera vibration on hits & explosions
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => update({ screenShake: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </label>

            {/* Particles */}
            <label className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white">PARTICLE EXPLOSIONS</div>
                  <div className="text-[10px] text-slate-500">
                    Engine plasma trails, sparks, and debris rings
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.particlesEnabled}
                onChange={(e) => update({ particlesEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};
