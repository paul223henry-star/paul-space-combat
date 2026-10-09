import { ENEMY_CONFIGS } from '../config/enemies';
import { GAME_CONFIG } from '../config/gameConfig';
import { EnemyEntity, EnemyType, Projectile } from '../types/game';
import { clamp, randomRange } from '../../lib/utils';

export class Enemy implements EnemyEntity {
  public id: string;
  public type: EnemyType;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public vx: number;
  public vy: number;
  public health: number;
  public maxHealth: number;
  public scoreValue: number;
  public fireCooldown: number;
  public fireRate: number;
  public color: string;
  public glowColor: string;
  public targetX?: number;
  public behaviorTimer: number = 0;
  public powerUpDropChance: number;

  private sineOffset: number = Math.random() * Math.PI * 2;

  constructor(type: EnemyType, startX?: number) {
    const config = ENEMY_CONFIGS[type];
    this.id = `enemy_${Date.now()}_${Math.random()}`;
    this.type = type;
    this.width = config.width;
    this.height = config.height;

    // Spawn slightly above arena
    this.x = startX ?? randomRange(30, GAME_CONFIG.WORLD_WIDTH - this.width - 30);
    this.y = -this.height - randomRange(10, 40);

    this.health = config.health;
    this.maxHealth = config.health;
    this.scoreValue = config.scoreValue;
    this.fireRate = config.fireRate;
    this.fireCooldown = randomRange(0.5, config.fireRate);
    this.color = config.color;
    this.glowColor = config.glowColor;
    this.powerUpDropChance = config.powerUpDropChance;

    // Initial velocities based on type
    switch (type) {
      case 'SCOUT':
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 80;
        this.vy = config.speed;
        break;
      case 'FIGHTER':
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 50;
        this.vy = config.speed;
        break;
      case 'TANK':
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 35;
        this.vy = config.speed;
        break;
      case 'SHOOTER':
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 90;
        this.vy = 80;
        this.targetX = randomRange(80, GAME_CONFIG.WORLD_WIDTH - 80);
        break;
      case 'ELITE':
        this.vx = 120;
        this.vy = 65;
        break;
    }
  }

  public update(dt: number, playerX: number, playerY: number): Projectile[] {
    this.behaviorTimer += dt;
    const projectiles: Projectile[] = [];

    // Movement AI
    switch (this.type) {
      case 'SCOUT':
        // Fast oscillating dive
        this.y += this.vy * dt;
        this.x += Math.sin(this.behaviorTimer * 4 + this.sineOffset) * 140 * dt;
        break;

      case 'FIGHTER':
        // Forward glide with boundary bounce
        this.y += this.vy * dt;
        this.x += this.vx * dt;
        if (this.x <= 20 || this.x >= GAME_CONFIG.WORLD_WIDTH - this.width - 20) {
          this.vx = -this.vx;
        }
        break;

      case 'TANK':
        // Heavy, steady march
        this.y += this.vy * dt;
        this.x += this.vx * dt;
        if (this.x <= 30 || this.x >= GAME_CONFIG.WORLD_WIDTH - this.width - 30) {
          this.vx = -this.vx;
        }
        break;

      case 'SHOOTER':
        // Enters arena, stays in upper third (y <= 240), strafes left/right
        if (this.y < 120) {
          this.y += this.vy * dt;
        } else {
          this.x += this.vx * dt;
          if (this.x <= 40 || this.x >= GAME_CONFIG.WORLD_WIDTH - this.width - 40) {
            this.vx = -this.vx;
          }
        }
        break;

      case 'ELITE':
        // Sweeping predator flight
        this.x += this.vx * dt;
        this.y += Math.sin(this.behaviorTimer * 2) * 50 * dt + 35 * dt;
        if (this.x <= 30 || this.x >= GAME_CONFIG.WORLD_WIDTH - this.width - 30) {
          this.vx = -this.vx;
        }
        break;
    }

    // Weapon firing AI
    const canShoot = ENEMY_CONFIGS[this.type].canShoot;
    if (canShoot && this.y > 20 && this.y < GAME_CONFIG.WORLD_HEIGHT - 60) {
      this.fireCooldown -= dt;
      if (this.fireCooldown <= 0) {
        this.fireCooldown = this.fireRate;
        projectiles.push(...this.fireProjectiles(playerX, playerY));
      }
    }

    return projectiles;
  }

  private fireProjectiles(playerX: number, playerY: number): Projectile[] {
    const projectiles: Projectile[] = [];
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height;
    const speed = GAME_CONFIG.PROJECTILES.ENEMY_SPEED;

    if (this.type === 'FIGHTER') {
      // Direct downward plasma bolt
      projectiles.push({
        id: `ep_${Math.random()}`,
        x: cx,
        y: cy,
        vx: 0,
        vy: speed,
        radius: 4,
        damage: 15,
        isPlayer: false,
        color: '#60a5fa',
        glowColor: 'rgba(96, 165, 250, 0.8)',
      });
    } else if (this.type === 'TANK') {
      // Twin heavy cannons
      projectiles.push({
        id: `ep_${Math.random()}`,
        x: cx - 14,
        y: cy,
        vx: -25,
        vy: speed * 0.85,
        radius: 5.5,
        damage: 25,
        isPlayer: false,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.8)',
      });
      projectiles.push({
        id: `ep_${Math.random()}`,
        x: cx + 14,
        y: cy,
        vx: 25,
        vy: speed * 0.85,
        radius: 5.5,
        damage: 25,
        isPlayer: false,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.8)',
      });
    } else if (this.type === 'SHOOTER') {
      // Targeted sniper beam at player's location
      const dx = (playerX + 21) - cx;
      const dy = (playerY + 24) - cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      projectiles.push({
        id: `ep_${Math.random()}`,
        x: cx,
        y: cy,
        vx: (dx / len) * speed * 1.15,
        vy: (dy / len) * speed * 1.15,
        radius: 4,
        damage: 20,
        isPlayer: false,
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.8)',
      });
    } else if (this.type === 'ELITE') {
      // 3-way shotgun spread
      const angles = [-0.25, 0, 0.25];
      angles.forEach((angle) => {
        projectiles.push({
          id: `ep_${Math.random()}`,
          x: cx,
          y: cy,
          vx: Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          radius: 4.5,
          damage: 22,
          isPlayer: false,
          color: '#f87171',
          glowColor: 'rgba(248, 113, 113, 0.8)',
        });
      });
    }

    return projectiles;
  }

  public takeDamage(amount: number): boolean {
    this.health = Math.max(0, this.health - amount);
    return this.health <= 0;
  }

  public isOutOfBounds(): boolean {
    return this.y > GAME_CONFIG.WORLD_HEIGHT + 60;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.glowColor;

    switch (this.type) {
      case 'SCOUT':
        // Agile arrow interceptor
        ctx.fillStyle = '#083344';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(cx, this.y + 6);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'FIGHTER':
        // Twin-wing blue fighter
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + 10);
        ctx.lineTo(cx + 8, this.y);
        ctx.lineTo(cx - 8, this.y);
        ctx.lineTo(this.x, this.y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Core light
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'TANK':
        // Heavy hex armored dreadnought
        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height - 12);
        ctx.lineTo(this.x + this.width, this.y + 10);
        ctx.lineTo(cx + 14, this.y);
        ctx.lineTo(cx - 14, this.y);
        ctx.lineTo(this.x, this.y + 10);
        ctx.lineTo(this.x, this.y + this.height - 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Armor plating accents
        ctx.fillStyle = this.color;
        ctx.fillRect(cx - 8, this.y + 8, 16, 8);
        break;

      case 'SHOOTER':
        // Purple rotating energy sniper
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, this.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy);
        ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10);
        ctx.lineTo(cx, cy + 10);
        ctx.stroke();
        break;

      case 'ELITE':
        // Menacing red marauder warship
        ctx.fillStyle = '#2a0a0a';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, this.y + this.height + 4);
        ctx.lineTo(this.x + this.width + 2, this.y + 8);
        ctx.lineTo(cx + 12, this.y);
        ctx.lineTo(cx, this.y + 8);
        ctx.lineTo(cx - 12, this.y);
        ctx.lineTo(this.x - 2, this.y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dual plasma conduits
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 9, cy, 4, 8);
        ctx.fillRect(cx + 5, cy, 4, 8);
        break;
    }

    // Mini Health Bar above enemy if damaged
    if (this.health < this.maxHealth) {
      const barWidth = this.width;
      const barHeight = 3;
      const barX = this.x;
      const barY = this.y - 8;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      const healthPct = this.health / this.maxHealth;
      ctx.fillStyle = healthPct > 0.5 ? '#10b981' : healthPct > 0.25 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);
    }

    ctx.restore();
  }
}
