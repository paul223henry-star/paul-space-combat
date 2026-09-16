import { PlayerData, GameSettings } from '../game/types/game';

const STORAGE_KEY = 'space_combat_player_data';

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.8,
  musicVolume: 0.5,
  muted: false,
  screenShake: true,
  particlesEnabled: true,
  reducedMotion: false,
};

export const DEFAULT_PLAYER_DATA: PlayerData = {
  highScore: 0,
  bestWave: 1,
  totalEnemiesDestroyed: 0,
  totalGamesPlayed: 0,
  bossesDefeated: 0,
  settings: DEFAULT_SETTINGS,
};

export function loadPlayerData(): PlayerData {
  if (typeof window === 'undefined') {
    return DEFAULT_PLAYER_DATA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLAYER_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_DATA,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return DEFAULT_PLAYER_DATA;
  }
}

export function savePlayerData(data: Partial<PlayerData>): PlayerData {
  if (typeof window === 'undefined') {
    return DEFAULT_PLAYER_DATA;
  }
  try {
    const current = loadPlayerData();
    const updated: PlayerData = {
      ...current,
      ...data,
      settings: {
        ...current.settings,
        ...(data.settings || {}),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_PLAYER_DATA;
  }
}

export function recordGameSessionEnd(score: number, wave: number, enemiesKilled: number, bossKilled: boolean): PlayerData {
  const current = loadPlayerData();
  const updated: PlayerData = {
    ...current,
    highScore: Math.max(current.highScore, score),
    bestWave: Math.max(current.bestWave, wave),
    totalEnemiesDestroyed: current.totalEnemiesDestroyed + enemiesKilled,
    totalGamesPlayed: current.totalGamesPlayed + 1,
    bossesDefeated: current.bossesDefeated + (bossKilled ? 1 : 0),
  };
  savePlayerData(updated);
  return updated;
}
