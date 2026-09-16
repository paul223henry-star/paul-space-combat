export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'BOSS' | 'GAMEOVER';

export interface Vector2D {
  x: number;
  y: number;
}

export type EnemyType = 'SCOUT' | 'FIGHTER' | 'TANK' | 'SHOOTER' | 'ELITE';

export type PowerUpType = 
  | 'RAPID_FIRE'
  | 'SHIELD'
  | 'DAMAGE_BOOST'
  | 'HEALTH'
  | 'MULTI_SHOT'
  | 'SCORE_BOOST';

export interface PowerUpConfig {
  type: PowerUpType;
  name: string;
  duration: number; // in seconds, 0 for instant (like health)
  color: string;
  symbol: string;
  description: string;
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
  duration: number;
}

export interface PlayerStats {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  baseFireRate: number; // delay in ms between shots
  damage: number;
  score: number;
  combo: number;
  comboTimer: number;
  maxComboTimer: number;
  activePowerUps: Map<PowerUpType, ActivePowerUp>;
  invulnerableTime: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayer: boolean;
  color: string;
  glowColor: string;
}

export interface EnemyEntity {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  scoreValue: number;
  fireCooldown: number;
  fireRate: number;
  color: string;
  glowColor: string;
  targetX?: number;
  behaviorTimer?: number;
}

export type BossPhase = 1 | 2 | 3 | 4;

export interface BossEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  phase: BossPhase;
  phaseTitle: string;
  vx: number;
  vy: number;
  attackTimer: number;
  specialAttackTimer: number;
  color: string;
  shieldActive: boolean;
  shieldHealth: number;
  maxShieldHealth: number;
}

export interface PowerUpEntity {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
  duration: number;
  color: string;
  symbol: string;
  age: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  shape?: 'circle' | 'spark' | 'ring';
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  layer: number;
}

export interface WaveConfig {
  waveNumber: number;
  totalEnemies: number;
  spawnInterval: number; // in seconds
  enemyTypes: EnemyType[];
  isBossWave: boolean;
  bossType?: string;
  waveName: string;
}

export interface GameSettings {
  masterVolume: number; // 0 - 1
  sfxVolume: number;    // 0 - 1
  musicVolume: number;  // 0 - 1
  muted: boolean;
  screenShake: boolean;
  particlesEnabled: boolean;
  reducedMotion: boolean;
}

export interface PlayerData {
  highScore: number;
  bestWave: number;
  totalEnemiesDestroyed: number;
  totalGamesPlayed: number;
  bossesDefeated: number;
  settings: GameSettings;
}

export interface GameSession {
  score: number;
  wave: number;
  enemiesDestroyed: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerShield: number;
  playerMaxShield: number;
  combo: number;
  comboTimerPct: number;
  bossActive: boolean;
  bossHealth: number;
  bossMaxHealth: number;
  bossName: string;
  bossPhase: BossPhase;
  activePowerUps: ActivePowerUp[];
  state: GameState;
  announcement?: string;
  announcementSubtitle?: string;
}
