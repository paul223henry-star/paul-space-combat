'use client';

import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../../game/engine/GameEngine';
import { GameSession, GameSettings } from '../../game/types/game';

interface GameCanvasProps {
  settings: GameSettings;
  onSessionUpdate: (session: GameSession) => void;
  engineRef: React.MutableRefObject<GameEngine | null>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  settings,
  onSessionUpdate,
  engineRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, settings);
    engine.setSessionChangeCallback(onSessionUpdate);
    engineRef.current = engine;

    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update settings in engine when user alters settings in modal
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSettings(settings);
    }
  }, [settings, engineRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-space-darkest">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
};
