import { GAME_CONFIG } from '../config/gameConfig';
import { GameSession, GameState, GameSettings, WaveConfig, PowerUpType } from '../types/game';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { Projectile } from '../types/game';
import { PowerUp } from '../entities/PowerUp';
import { Particle } from '../entities/Particle';
import { InputSystem } from '../systems/InputSystem';
import { WaveSystem } from '../systems/WaveSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { Renderer } from './Renderer';
import { GameLoop } from './GameLoop';
import { audioEngine } from './AudioEngine';
import { recordGameSessionEnd } from '../../lib/storage';
import { randomRange } from '../../lib/utils';

export class GameEngine {
  public state: GameState = 'MENU';
  public player: Player;
  public enemies: Enemy[] = [];
  public boss: Boss | null = null;
  public projectiles: Projectile[] = [];
  public powerUps: PowerUp[] = [];
  public particles: Particle[] = [];

  public input: InputSystem;
  public waveSystem: WaveSystem;
  public scoreSystem: ScoreSystem;
  public collisionSystem: CollisionSystem;
  public renderer: Renderer;
  public gameLoop: GameLoop;

  // Viewport & Scale
  private canvas: HTMLCanvasElement;
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // Announcements
  private announcement: { title: string; subtitle?: string; alpha: number; timer: number } | null = null;

  // React session bridge
  private onSessionChange?: (session: GameSession) => void;
  private lastSessionEmitTime: number = 0;
  private settings: GameSettings;

  constructor(canvas: HTMLCanvasElement, settings: GameSettings) {
    this.canvas = canvas;
    this.settings = settings;

    const ctx = canvas.getContext('2d')!;
    this.renderer = new Renderer(ctx);

    this.player = new Player();
    this.input = new InputSystem();
    this.waveSystem = new WaveSystem();
    this.scoreSystem = new ScoreSystem();
    this.collisionSystem = new CollisionSystem();

    this.gameLoop = new GameLoop(this.tick.bind(this));

    // Bind wave announcements
    this.waveSystem.setWaveStartCallback(this.handleWaveStart.bind(this));

    // Input listeners
    this.input.attach(
      () => this.togglePause(),
      () => {
        if (this.state === 'GAMEOVER') {
          this.startNewGame();
        }
      }
    );

    // Audio init
    audioEngine.init(settings);

    // Initialize dimensions
    this.resize();

    // Start background rendering loop
    this.gameLoop.start();
  }

  public setSettings(settings: GameSettings) {
    this.settings = settings;
    audioEngine.applySettings(settings);
  }

  public setSessionChangeCallback(cb: (session: GameSession) => void) {
    this.onSessionChange = cb;
  }

  public resize() {
    const parent = this.canvas.parentElement;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const containerWidth = (parent && parent.clientWidth > 0) ? parent.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : GAME_CONFIG.WORLD_WIDTH);
    const containerHeight = (parent && parent.clientHeight > 0) ? parent.clientHeight : (typeof window !== 'undefined' ? window.innerHeight : GAME_CONFIG.WORLD_HEIGHT);

    this.canvas.width = Math.max(containerWidth * dpr, 100);
    this.canvas.height = Math.max(containerHeight * dpr, 100);

    // Calculate aspect ratio scale to fit inside container
    const scaleX = (containerWidth * dpr) / GAME_CONFIG.WORLD_WIDTH;
    const scaleY = (containerHeight * dpr) / GAME_CONFIG.WORLD_HEIGHT;
    this.scale = Math.max(Math.min(scaleX, scaleY), 0.1);

    this.offsetX = (this.canvas.width - GAME_CONFIG.WORLD_WIDTH * this.scale) / 2;
    this.offsetY = (this.canvas.height - GAME_CONFIG.WORLD_HEIGHT * this.scale) / 2;
  }

  public startNewGame() {
    this.player.reset();
    this.enemies = [];
    this.boss = null;
    this.projectiles = [];
    this.powerUps = [];
    this.particles = [];

    this.waveSystem.reset();
    this.scoreSystem.reset();

    this.state = 'PLAYING';
    audioEngine.resume();
    audioEngine.startMusic();

    this.showAnnouncement('WAVE 1', 'SCOUT PROBES INCOMING', 2.5);
    this.emitSessionUpdate(true);
    this.gameLoop.start();
  }

  public togglePause() {
    if (this.state === 'PLAYING' || this.state === 'BOSS') {
      this.state = 'PAUSED';
      this.emitSessionUpdate(true);
    } else if (this.state === 'PAUSED') {
      this.state = this.boss ? 'BOSS' : 'PLAYING';
      this.emitSessionUpdate(true);
    }
  }

  public resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = this.boss ? 'BOSS' : 'PLAYING';
      this.emitSessionUpdate(true);
    }
  }

  public returnToMenu() {
    this.state = 'MENU';
    audioEngine.stopMusic();
    this.emitSessionUpdate(true);
  }

  private handleWaveStart(wave: WaveConfig) {
    if (wave.isBossWave) {
      this.state = 'BOSS';
      audioEngine.playBossAlarm();
      this.showAnnouncement('WARNING: SECTOR TITAN', wave.bossType || 'VOID DESTROYER', 3.0);
      if (this.settings.screenShake) {
        this.renderer.triggerScreenShake(GAME_CONFIG.SHAKE.BOSS_ATTACK, 1.0);
      }
    } else {
      this.showAnnouncement(`WAVE ${wave.waveNumber}`, wave.waveName, 2.0);
    }
  }

  private showAnnouncement(title: string, subtitle: string, duration: number) {
    this.announcement = {
      title,
      subtitle,
      alpha: 1.0,
      timer: duration,
    };
  }

  private tick(dt: number, now: number) {
    if (this.state !== 'PAUSED') {
      this.update(dt, now);
    }
    this.render();
    this.emitSessionUpdate();
  }

  private update(dt: number, now: number) {
    // 1. Renderer effects update
    this.renderer.update(dt);

    // 2. Announcements update
    if (this.announcement) {
      this.announcement.timer -= dt;
      if (this.announcement.timer <= 0.5) {
        this.announcement.alpha = Math.max(0, this.announcement.timer / 0.5);
      }
      if (this.announcement.timer <= 0) {
        this.announcement = null;
      }
    }

    if (this.state === 'GAMEOVER' || this.state === 'MENU') {
      // Keep particles alive during gameover
      this.particles = this.particles.filter((p) => p.update(dt));
      return;
    }

    // 3. Player Movement & Actions
    let moveX = 0;
    let moveY = 0;
    if (this.input.isMovingLeft()) moveX -= 1;
    if (this.input.isMovingRight()) moveX += 1;
    if (this.input.isMovingUp()) moveY -= 1;
    if (this.input.isMovingDown()) moveY += 1;

    if (moveX !== 0 && moveY !== 0) {
      // Normalize diagonal speed
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    this.player.update(dt, moveX, moveY);

    // Thruster engine particles
    if (this.settings.particlesEnabled && Math.random() < 0.7) {
      this.particles.push(
        new Particle(
          this.player.x + this.player.width / 2 + randomRange(-4, 4),
          this.player.y + this.player.height,
          randomRange(-15, 15),
          randomRange(80, 160),
          randomRange(1.5, 3),
          '#38bdf8',
          2.5,
          'spark'
        )
      );
    }

    // Player Shooting
    if (this.input.isShooting() && this.player.canShoot(now)) {
      const newLasers = this.player.fire(now);
      this.projectiles.push(...newLasers);
      const isMulti = this.player.activePowerUps.has('MULTI_SHOT');
      audioEngine.playPlayerShoot(isMulti);
    }

    // 4. Wave System & Enemy Spawning
    const waveOutcome = this.waveSystem.update(dt, this.enemies.length, !!this.boss);
    if (waveOutcome.spawnEnemy && waveOutcome.enemyType) {
      this.enemies.push(new Enemy(waveOutcome.enemyType));
    }
    if (waveOutcome.triggerBoss) {
      this.boss = new Boss(this.waveSystem.currentWaveConfig.bossType || 'VOID DESTROYER');
      this.state = 'BOSS';
      audioEngine.playBossAlarm();
      this.showAnnouncement('WARNING: SECTOR TITAN', this.boss.name, 3.0);
    }

    // 5. Update Enemies
    for (const enemy of this.enemies) {
      const enemyShots = enemy.update(dt, this.player.x, this.player.y);
      if (enemyShots.length > 0) {
        this.projectiles.push(...enemyShots);
        audioEngine.playEnemyShoot();
      }
    }
    this.enemies = this.enemies.filter((e) => !e.isOutOfBounds());

    // 6. Update Boss
    if (this.boss) {
      const bossShots = this.boss.update(dt, this.player.x, this.player.y);
      if (bossShots.length > 0) {
        this.projectiles.push(...bossShots);
        audioEngine.playEnemyShoot();
      }
    }

    // 7. Update Projectiles
    for (const p of this.projectiles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    this.projectiles = this.projectiles.filter(
      (p) => p.x >= -20 && p.x <= GAME_CONFIG.WORLD_WIDTH + 20 && p.y >= -20 && p.y <= GAME_CONFIG.WORLD_HEIGHT + 20
    );

    // 8. Update Power-Ups
    for (const pu of this.powerUps) {
      pu.update(dt);
    }
    this.powerUps = this.powerUps.filter((pu) => !pu.isOutOfBounds());

    // 9. Update Particles
    this.particles = this.particles.filter((p) => p.update(dt));

    // 10. Update Score & Combos
    this.scoreSystem.update(dt);

    // 11. Run Collision System
    const col = this.collisionSystem.checkCollisions(
      this.player,
      this.enemies,
      this.boss,
      this.projectiles,
      this.powerUps
    );

    // Remove hit projectiles
    if (col.hitProjectiles.length > 0) {
      const hitSet = new Set(col.hitProjectiles);
      this.projectiles = this.projectiles.filter((p) => !hitSet.has(p.id));
      audioEngine.playHit();
    }

    // Process destroyed enemies
    if (col.destroyedEnemyIds.length > 0) {
      const deadSet = new Set(col.destroyedEnemyIds);
      const killed = this.enemies.filter((e) => deadSet.has(e.id));

      for (const enemy of killed) {
        this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color, false);
        audioEngine.playExplosion(false);

        const hasScoreBoost = this.player.activePowerUps.has('SCORE_BOOST');
        this.scoreSystem.registerKill(enemy.scoreValue, hasScoreBoost);

        // Power-Up drop chance
        if (Math.random() < enemy.powerUpDropChance) {
          this.spawnRandomPowerUp(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        }
      }

      this.enemies = this.enemies.filter((e) => !deadSet.has(e.id));
    }

    // Boss Damaged / Defeated
    if (this.boss && this.boss.health <= 0) {
      this.createExplosion(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2, '#38bdf8', true);
      audioEngine.playExplosion(true);

      const hasScoreBoost = this.player.activePowerUps.has('SCORE_BOOST');
      this.scoreSystem.registerKill(GAME_CONFIG.SCORE.BOSS, hasScoreBoost);

      this.boss = null;
      this.state = 'PLAYING';
      if (this.settings.screenShake) {
        this.renderer.triggerScreenShake(GAME_CONFIG.SHAKE.BOSS_EXPLODE, 0.8);
      }
      this.showAnnouncement('BOSS DESTROYED!', 'SECTOR PURIFIED - HYPERDRIVE READY', 3.0);
    }

    // Player Damaged / Death Check
    if (col.playerDamaged) {
      if (this.settings.screenShake) {
        this.renderer.triggerScreenShake(col.screenShakeIntensity, 0.25);
      }

      if (this.player.shield > 0) {
        audioEngine.playShieldHit();
      } else {
        audioEngine.playHit();
      }

      if (this.player.health <= 0) {
        this.triggerGameOver();
        return;
      }
    }

    // Collected Power-Ups
    if (col.collectedPowerUpIds.length > 0) {
      const puSet = new Set(col.collectedPowerUpIds);
      const picked = this.powerUps.filter((p) => puSet.has(p.id));

      for (const p of picked) {
        this.player.applyPowerUp(p.type, p.duration);
        audioEngine.playPowerUp();
        // Floating ring particle
        this.particles.push(
          new Particle(p.x, p.y, 0, 0, 16, p.color, 2.0, 'ring')
        );
      }

      this.powerUps = this.powerUps.filter((p) => !puSet.has(p.id));
    }
  }

  private createExplosion(x: number, y: number, color: string, isLarge: boolean) {
    if (!this.settings.particlesEnabled) return;

    const count = isLarge ? 50 : 20;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(isLarge ? 80 : 40, isLarge ? 280 : 180);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.particles.push(
        new Particle(
          x,
          y,
          vx,
          vy,
          randomRange(2, isLarge ? 6 : 4),
          color,
          randomRange(1.2, 2.5),
          'spark'
        )
      );
    }

    // Expanding shockwave ring
    this.particles.push(
      new Particle(x, y, 0, 0, 10, color, isLarge ? 1.0 : 1.8, 'ring')
    );
  }

  private spawnRandomPowerUp(x: number, y: number) {
    const types: PowerUpType[] = [
      'RAPID_FIRE',
      'SHIELD',
      'DAMAGE_BOOST',
      'HEALTH',
      'MULTI_SHOT',
      'SCORE_BOOST',
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    this.powerUps.push(new PowerUp(chosen, x, y));
  }

  private triggerGameOver() {
    this.state = 'GAMEOVER';
    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#ef4444', true);
    audioEngine.playExplosion(true);
    audioEngine.stopMusic();

    recordGameSessionEnd(
      this.scoreSystem.score,
      this.waveSystem.currentWaveNumber,
      this.scoreSystem.enemiesDestroyed,
      false
    );

    this.emitSessionUpdate(true);
  }

  private render() {
    const announcementData = this.announcement
      ? {
          title: this.announcement.title,
          subtitle: this.announcement.subtitle,
          alpha: this.announcement.alpha,
        }
      : undefined;

    this.renderer.render(
      this.scale,
      this.offsetX,
      this.offsetY,
      this.player,
      this.enemies,
      this.boss,
      this.projectiles,
      this.powerUps,
      this.particles,
      announcementData
    );
  }

  private emitSessionUpdate(force: boolean = false) {
    const now = performance.now();
    // Throttle React state dispatch to ~25fps (every 40ms) unless forced
    if (!force && now - this.lastSessionEmitTime < 40) return;
    this.lastSessionEmitTime = now;

    if (!this.onSessionChange) return;

    const activePowerUpsList = Array.from(this.player.activePowerUps.values());

    const session: GameSession = {
      score: this.scoreSystem.score,
      wave: this.waveSystem.currentWaveNumber,
      enemiesDestroyed: this.scoreSystem.enemiesDestroyed,
      playerHealth: this.player.health,
      playerMaxHealth: this.player.maxHealth,
      playerShield: this.player.shield,
      playerMaxShield: this.player.maxShield,
      combo: this.scoreSystem.combo,
      comboTimerPct: this.scoreSystem.getComboProgress(),
      bossActive: !!this.boss,
      bossHealth: this.boss ? this.boss.health : 0,
      bossMaxHealth: this.boss ? this.boss.maxHealth : 1,
      bossName: this.boss ? this.boss.name : '',
      bossPhase: this.boss ? this.boss.phase : 1,
      activePowerUps: activePowerUpsList,
      state: this.state,
      announcement: this.announcement?.title,
      announcementSubtitle: this.announcement?.subtitle,
    };

    this.onSessionChange(session);
  }

  public destroy() {
    this.gameLoop.stop();
    this.input.detach();
    audioEngine.destroy();
  }
}
