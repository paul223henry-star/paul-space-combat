export const GAME_CONFIG = {
  // Virtual arena dimensions (responsive canvas maps into this coordinate space)
  WORLD_WIDTH: 900,
  WORLD_HEIGHT: 700,

  // Player defaults
  PLAYER: {
    WIDTH: 42,
    HEIGHT: 48,
    SPEED: 380, // pixels/second
    INITIAL_HEALTH: 100,
    MAX_HEALTH: 100,
    INITIAL_SHIELD: 50,
    MAX_SHIELD: 100,
    BASE_FIRE_RATE: 160, // ms between regular shots
    DAMAGE: 25,
    INVULNERABLE_DURATION: 1.5, // seconds after hit
  },

  // Projectile speeds
  PROJECTILES: {
    PLAYER_SPEED: 750,
    ENEMY_SPEED: 320,
    BOSS_SPEED: 260,
  },

  // Scoring and combos
  SCORE: {
    COMBO_TIMEOUT: 2.8, // seconds before combo resets
    COMBO_MULTIPLIER_MAX: 10,
    SCOUT: 100,
    FIGHTER: 200,
    TANK: 400,
    SHOOTER: 300,
    ELITE: 750,
    BOSS: 5000,
  },

  // Visuals
  PARTICLES: {
    MAX_PARTICLES: 350,
    STAR_COUNT: 120,
  },

  // Screen shake
  SHAKE: {
    PLAYER_HIT: 8,
    ENEMY_EXPLODE: 4,
    BOSS_EXPLODE: 25,
    BOSS_ATTACK: 6,
  },
};
