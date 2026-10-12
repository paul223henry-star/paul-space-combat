'use client';

import React, { useEffect } from 'react';
import { GameEngine } from '../../game/engine/GameEngine';
import { Pause, Flame } from 'lucide-react';

interface MobileControlsProps {
  engineRef: React.MutableRefObject<GameEngine | null>;
  onPause: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  engineRef,
  onPause,
}) => {
  // Ensure shooting is safely cleared if controls unmount
  useEffect(() => {
    return () => {
      engineRef.current?.input.setTouchShooting(false);
    };
  }, [engineRef]);

  const handleFirePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Fallback if pointer capture is unsupported
    }
    engineRef.current?.input.setTouchShooting(true);
  };

  const handleFirePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore
    }
    engineRef.current?.input.setTouchShooting(false);
  };

  const handleFirePointerCancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    engineRef.current?.input.setTouchShooting(false);
  };

  const handleFireLostPointerCapture = () => {
    engineRef.current?.input.setTouchShooting(false);
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 select-none md:hidden"
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Mobile Pause Button */}
      <button
        type="button"
        aria-label="Pause Game"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onPause();
        }}
        className="pointer-events-auto absolute right-3 top-16 flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-slate-950/85 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-950/30 backdrop-blur-sm active:bg-cyan-500/30 active:scale-95 transition-transform"
        style={{ touchAction: 'none' }}
      >
        <Pause className="w-3.5 h-3.5" />
        <span>PAUSE</span>
      </button>

      {/* Mobile Continuous Press-and-Hold Fire Button */}
      <button
        type="button"
        aria-label="Fire Lasers"
        onPointerDown={handleFirePointerDown}
        onPointerUp={handleFirePointerUp}
        onPointerCancel={handleFirePointerCancel}
        onLostPointerCapture={handleFireLostPointerCapture}
        className="pointer-events-auto absolute bottom-6 right-6 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-cyan-300/80 bg-slate-950/85 font-mono font-black text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.35)] backdrop-blur-md active:bg-cyan-500/40 active:scale-95 transition-all"
        style={{ touchAction: 'none' }}
      >
        <Flame className="w-5 h-5 text-cyan-300 fill-cyan-400/40 mb-0.5 animate-pulse" />
        <span className="text-xs tracking-wider">FIRE</span>
      </button>
    </div>
  );
};
