import { WaveConfig } from '../types/game';

export const BASE_WAVES: WaveConfig[] = [
  {
    waveNumber: 1,
    totalEnemies: 8,
    spawnInterval: 1.8,
    enemyTypes: ['SCOUT'],
    isBossWave: false,
    waveName: 'Wave 1: Scout Probes Incoming',
  },
  {
    waveNumber: 2,
    totalEnemies: 12,
    spawnInterval: 1.5,
    enemyTypes: ['SCOUT', 'FIGHTER'],
    isBossWave: false,
    waveName: 'Wave 2: Fighter Squadron Alert',
  },
  {
    waveNumber: 3,
    totalEnemies: 16,
    spawnInterval: 1.3,
    enemyTypes: ['SCOUT', 'FIGHTER', 'SHOOTER'],
    isBossWave: false,
    waveName: 'Wave 3: Heavy Artillery Incursion',
  },
  {
    waveNumber: 4,
    totalEnemies: 20,
    spawnInterval: 1.1,
    enemyTypes: ['FIGHTER', 'TANK', 'SHOOTER', 'ELITE'],
    isBossWave: false,
    waveName: 'Wave 4: Armored Vanguard Siege',
  },
  {
    waveNumber: 5,
    totalEnemies: 0,
    spawnInterval: 0,
    enemyTypes: [],
    isBossWave: true,
    bossType: 'VOID DESTROYER',
    waveName: 'Wave 5: BOSS - VOID DESTROYER',
  },
  {
    waveNumber: 6,
    totalEnemies: 22,
    spawnInterval: 1.0,
    enemyTypes: ['FIGHTER', 'SHOOTER', 'ELITE'],
    isBossWave: false,
    waveName: 'Wave 6: Counter-Offensive',
  },
  {
    waveNumber: 7,
    totalEnemies: 26,
    spawnInterval: 0.9,
    enemyTypes: ['SCOUT', 'TANK', 'ELITE', 'SHOOTER'],
    isBossWave: false,
    waveName: 'Wave 7: Sector Cleansing',
  },
  {
    waveNumber: 8,
    totalEnemies: 30,
    spawnInterval: 0.85,
    enemyTypes: ['FIGHTER', 'TANK', 'ELITE'],
    isBossWave: false,
    waveName: 'Wave 8: Hyper-Dense Assault',
  },
  {
    waveNumber: 9,
    totalEnemies: 35,
    spawnInterval: 0.75,
    enemyTypes: ['SCOUT', 'FIGHTER', 'TANK', 'SHOOTER', 'ELITE'],
    isBossWave: false,
    waveName: 'Wave 9: Ultimate Armada Swarm',
  },
  {
    waveNumber: 10,
    totalEnemies: 0,
    spawnInterval: 0,
    enemyTypes: [],
    isBossWave: true,
    bossType: 'APOCALYPSE DREADNOUGHT',
    waveName: 'Wave 10: BOSS - APOCALYPSE DREADNOUGHT',
  },
];

export function getWaveConfig(waveNumber: number): WaveConfig {
  if (waveNumber <= BASE_WAVES.length) {
    return BASE_WAVES[waveNumber - 1];
  }
  // Endless procedural scaling beyond wave 10
  const isBoss = waveNumber % 5 === 0;
  return {
    waveNumber,
    totalEnemies: isBoss ? 0 : 25 + (waveNumber * 2),
    spawnInterval: Math.max(0.45, 1.2 - (waveNumber * 0.05)),
    enemyTypes: ['SCOUT', 'FIGHTER', 'TANK', 'SHOOTER', 'ELITE'],
    isBossWave: isBoss,
    bossType: `VOID TITAN MK-${Math.floor(waveNumber / 5)}`,
    waveName: isBoss ? `Wave ${waveNumber}: BOSS - TITAN OVERLORD` : `Wave ${waveNumber}: Infinite Deep Space Assault`,
  };
}
