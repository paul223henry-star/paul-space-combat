'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Shield, Zap, Sparkles, Crosshair, HelpCircle, Skull } from 'lucide-react';
import { POWER_UP_CONFIGS } from '../../game/config/powerups';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FLIGHT MANUAL & TACTICS" maxWidth="max-w-xl">
      <div className="flex flex-col gap-6 text-slate-300 font-mono text-xs select-none">
        {/* Core Controls */}
        <div>
          <div className="text-sm font-bold text-blue-400 pb-1.5 border-b border-slate-800 mb-3 flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            <span>FLIGHT CONTROLS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400">PILOT MOVEMENT</span>
              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 font-bold rounded">
                TOUCH DRAG / ARROWS
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400">FIRE LASERS</span>
              <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-blue-300 font-bold rounded">
                SPACE / FIRE BUTTON
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400">PAUSE SIMULATION</span>
              <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded">
                P / ESC
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400">QUICK RESTART</span>
              <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-red-300 font-bold rounded">
                R
              </span>
            </div>
          </div>
        </div>

        {/* Combat Loop & Combos */}
        <div>
          <div className="text-sm font-bold text-cyan-400 pb-1.5 border-b border-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>COMBO MULTIPLIER & SURVIVAL</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            Eliminate hostiles in rapid succession to ramp up your{' '}
            <strong className="text-amber-400">Combo Multiplier (up to x10)</strong>. Your Energy Shield
            absorbs projectile impacts before Hull HP takes damage. When damaged, a temporary invulnerability
            matrix flickers online to allow strategic escape.
          </p>
        </div>

        {/* Power-Ups Intel */}
        <div>
          <div className="text-sm font-bold text-purple-400 pb-1.5 border-b border-slate-800 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>POWER-UP CAPSULES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            {Object.values(POWER_UP_CONFIGS).map((pu) => (
              <div
                key={pu.type}
                className="flex items-center gap-3 p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border shadow-sm shrink-0"
                  style={{ borderColor: pu.color, backgroundColor: `${pu.color}22` }}
                >
                  {pu.symbol}
                </div>
                <div>
                  <div className="font-bold text-white">{pu.name}</div>
                  <div className="text-[10px] text-slate-400">{pu.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boss Encounters */}
        <div>
          <div className="text-sm font-bold text-red-400 pb-1.5 border-b border-slate-800 mb-2 flex items-center gap-2">
            <Skull className="w-4 h-4" />
            <span>TITAN BOSS ENCOUNTERS</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Boss dreadnoughts appear every 5 waves. They possess 4 evolving combat phases: radial nova attacks,
            targeted high-velocity snipers, and bullet hell spirals. Keep moving and unleash continuous fire to survive!
          </p>
        </div>
      </div>
    </Modal>
  );
};
