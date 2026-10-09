import { PowerUpType, PowerUpConfig } from '../types/game';

export const POWER_UP_CONFIGS: Record<PowerUpType, PowerUpConfig> = {
  RAPID_FIRE: {
    type: 'RAPID_FIRE',
    name: 'Rapid Fire',
    duration: 10,
    color: '#06b6d4', // cyan
    symbol: '⚡',
    description: 'Increases weapon fire rate by 100%',
  },
  SHIELD: {
    type: 'SHIELD',
    name: 'Shield Matrix',
    duration: 0, // instant +50 shield restore / boost
    color: '#3b82f6', // blue
    symbol: '🛡️',
    description: 'Restores +50 Shield energy',
  },
  DAMAGE_BOOST: {
    type: 'DAMAGE_BOOST',
    name: 'Plasma Overcharge',
    duration: 12,
    color: '#ef4444', // red
    symbol: '💥',
    description: 'Doubles laser projectile damage',
  },
  HEALTH: {
    type: 'HEALTH',
    name: 'Nanite Repair',
    duration: 0, // instant +35 health
    color: '#10b981', // green
    symbol: '💚',
    description: 'Restores +35 Ship Hull HP',
  },
  MULTI_SHOT: {
    type: 'MULTI_SHOT',
    name: 'Triple Cannon',
    duration: 12,
    color: '#a855f7', // purple
    symbol: '🔱',
    description: 'Fires 3-way spread laser barrage',
  },
  SCORE_BOOST: {
    type: 'SCORE_BOOST',
    name: 'Quantum Catalyst',
    duration: 15,
    color: '#f59e0b', // gold/amber
    symbol: '⭐',
    description: 'Doubles all score and combo earnings',
  },
};
