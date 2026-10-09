import { EnemyType } from '../types/game';

export interface EnemyStatsDefinition {
  type: EnemyType;
  name: string;
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  scoreValue: number;
  fireRate: number; // in seconds
  canShoot: boolean;
  color: string;
  glowColor: string;
  powerUpDropChance: number; // 0 to 1
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyStatsDefinition> = {
  SCOUT: {
    type: 'SCOUT',
    name: 'Vanguard Scout',
    width: 28,
    height: 32,
    speed: 210,
    health: 30,
    damage: 15,
    scoreValue: 100,
    fireRate: 2.5,
    canShoot: false,
    color: '#06b6d4', // cyan
    glowColor: 'rgba(6, 182, 212, 0.6)',
    powerUpDropChance: 0.12,
  },
  FIGHTER: {
    type: 'FIGHTER',
    name: 'Interceptor Fighter',
    width: 34,
    height: 38,
    speed: 160,
    health: 65,
    damage: 20,
    scoreValue: 200,
    fireRate: 2.2,
    canShoot: true,
    color: '#3b82f6', // blue
    glowColor: 'rgba(59, 130, 246, 0.6)',
    powerUpDropChance: 0.18,
  },
  TANK: {
    type: 'TANK',
    name: 'Dreadnought Tank',
    width: 52,
    height: 52,
    speed: 80,
    health: 190,
    damage: 35,
    scoreValue: 400,
    fireRate: 2.8,
    canShoot: true,
    color: '#f59e0b', // amber/orange
    glowColor: 'rgba(245, 158, 11, 0.6)',
    powerUpDropChance: 0.35,
  },
  SHOOTER: {
    type: 'SHOOTER',
    name: 'Pulse Sniper',
    width: 36,
    height: 40,
    speed: 110,
    health: 80,
    damage: 25,
    scoreValue: 300,
    fireRate: 1.6,
    canShoot: true,
    color: '#a855f7', // purple
    glowColor: 'rgba(168, 85, 247, 0.6)',
    powerUpDropChance: 0.25,
  },
  ELITE: {
    type: 'ELITE',
    name: 'Shadow Marauder',
    width: 44,
    height: 46,
    speed: 150,
    health: 260,
    damage: 40,
    scoreValue: 750,
    fireRate: 1.2,
    canShoot: true,
    color: '#ef4444', // crimson
    glowColor: 'rgba(239, 68, 68, 0.7)',
    powerUpDropChance: 0.6,
  },
};
