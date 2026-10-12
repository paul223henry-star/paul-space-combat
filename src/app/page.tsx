'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameCanvas } from '../components/game/GameCanvas';
import { GameHUD } from '../components/game/GameHUD';
import { MainMenu } from '../components/game/MainMenu';
import { PauseMenu } from '../components/game/PauseMenu';
import { GameOverModal } from '../components/game/GameOverModal';
import { SettingsModal } from '../components/game/SettingsModal';
import { HowToPlayModal } from '../components/game/HowToPlayModal';
import { ControlsOverlay } from '../components/game/ControlsOverlay';
import { MobileControls } from '../components/game/MobileControls';
import { GameEngine } from '../game/engine/GameEngine';
import { GameSession, PlayerData, GameSettings } from '../game/types/game';
import { loadPlayerData, savePlayerData, DEFAULT_PLAYER_DATA } from '../lib/storage';

const INITIAL_SESSION: GameSession = {
  score: 0,
  wave: 1,
  enemiesDestroyed: 0,
  playerHealth: 100,
  playerMaxHealth: 100,
  playerShield: 50,
  playerMaxShield: 100,
  combo: 1,
  comboTimerPct: 0,
  bossActive: false,
  bossHealth: 0,
  bossMaxHealth: 1000,
  bossName: '',
  bossPhase: 1,
  activePowerUps: [],
  state: 'MENU',
};

export default function SpaceCombatGamePage() {
  const [session, setSession] = useState<GameSession>(INITIAL_SESSION);
  const [playerData, setPlayerData] = useState<PlayerData>(DEFAULT_PLAYER_DATA);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const engineRef = useRef<GameEngine | null>(null);

  // Load persistent stats & settings on client mount
  useEffect(() => {
    setIsClient(true);
    const data = loadPlayerData();
    setPlayerData(data);
  }, []);

  const handleSessionUpdate = useCallback((newSession: GameSession) => {
    setSession(newSession);

    // Refresh player data when returning to menu or game over to update high score
    if (newSession.state === 'GAMEOVER' || newSession.state === 'MENU') {
      setPlayerData(loadPlayerData());
    }
  }, []);

  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.togglePause();
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.resumeGame();
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  };

  const handleReturnToMenu = () => {
    if (engineRef.current) {
      engineRef.current.returnToMenu();
    }
    setSession((prev) => ({ ...prev, state: 'MENU' }));
    setPlayerData(loadPlayerData());
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    const updated = savePlayerData({ settings: newSettings });
    setPlayerData(updated);
  };

  if (!isClient) {
    return (
      <main className="w-screen h-screen flex items-center justify-center bg-space-darkest">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-cyan-400 font-mono tracking-widest text-sm">
            INITIALIZING SPACE COMBAT...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-darkest scanlines vignette select-none">
      {/* 1. Real-time HTML5 Canvas Arena */}
      <GameCanvas
        settings={playerData.settings}
        onSessionUpdate={handleSessionUpdate}
        engineRef={engineRef}
      />
    {(session.state === 'PLAYING' || session.state === 'BOSS') && (
      <MobileControls
      engineRef={engineRef}
      onPause={handlePause}
     />
)}
      {/* 2. In-Game HUD overlay (Visible during active play, boss battles, and pause) */}
      {session.state !== 'MENU' && (
        <GameHUD session={session} onPauseClick={handlePause} />
      )}

      {/* 3. First-Run Keyboard Controls Overlay */}
      {(session.state === 'PLAYING' || session.state === 'BOSS') && (
        <ControlsOverlay />
      )}

      {/* 4. Main Menu Overlay */}
      {session.state === 'MENU' && (
        <MainMenu
          playerData={playerData}
          onPlayClick={handleStartGame}
          onHowToPlayClick={() => setShowHowToPlay(true)}
          onSettingsClick={() => setShowSettings(true)}
        />
      )}

      {/* 5. Pause Menu Overlay */}
      {session.state === 'PAUSED' && (
        <PauseMenu
          onResumeClick={handleResume}
          onRestartClick={handleRestart}
          onSettingsClick={() => setShowSettings(true)}
          onMainMenuClick={handleReturnToMenu}
        />
      )}

      {/* 6. Game Over Debriefing Modal */}
      {session.state === 'GAMEOVER' && (
        <GameOverModal
          session={session}
          playerData={playerData}
          onRestartClick={handleRestart}
          onMainMenuClick={handleReturnToMenu}
        />
      )}

      {/* 7. Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={playerData.settings}
        onSettingsChange={handleSettingsChange}
      />

      {/* 8. How To Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}
