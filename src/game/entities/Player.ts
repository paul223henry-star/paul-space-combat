import { GAME_CONFIG } from '../config/gameConfig';
import { ActivePowerUp, PowerUpType, Projectile } from '../types/game';
import { clamp } from '../../lib/utils';

export class Player {
  public x: number;
  public y: number;
  public width: number = GAME_CONFIG.PLAYER.WIDTH;
  public height: number = GAME_CONFIG.PLAYER.HEIGHT;
  public speed: number = GAME_CONFIG.PLAYER.SPEED;

  public health: number = GAME_CONFIG.PLAYER.INITIAL_HEALTH;
  public maxHealth: number = GAME_CONFIG.PLAYER.MAX_HEALTH;
  public shield: number = GAME_CONFIG.PLAYER.INITIAL_SHIELD;
  public maxShield: number = GAME_CONFIG.PLAYER.MAX_SHIELD;

  public baseDamage: number = GAME_CONFIG.PLAYER.DAMAGE;
  public baseFireRate: number = GAME_CONFIG.PLAYER.BASE_FIRE_RATE;
  public lastFireTime: number = 0;

  public invulnerableTime: number = 0; // seconds remaining
  public activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();
  public engineThrustAnim: number = 0;

  constructor() {
    this.x = (GAME_CONFIG.WORLD_WIDTH - this.width) / 2;
    this.y = GAME_CONFIG.WORLD_HEIGHT - this.height - 40;
  }

  public reset() {
    this.x = (GAME_CONFIG.WORLD_WIDTH - this.width) / 2;
    this.y = GAME_CONFIG.WORLD_HEIGHT - this.height - 40;
    this.health = this.maxHealth;
    this.shield = this.maxShield / 2;
    this.invulnerableTime = 0;
    this.activePowerUps.clear();
    this.lastFireTime = 0;
  }

  public update(dt: number, moveX: number, moveY: number) {
    // Delta-time based smooth movement
    this.x += moveX * this.speed * dt;
    this.y += moveY * this.speed * dt;

    // Boundaries clamping inside virtual world
    this.x = clamp(this.x, 15, GAME_CONFIG.WORLD_WIDTH - this.width - 15);
    this.y = clamp(this.y, 40, GAME_CONFIG.WORLD_HEIGHT - this.height - 20);

    // Update invulnerability
    if (this.invulnerableTime > 0) {
      this.invulnerableTime = Math.max(0, this.invulnerableTime - dt);
    }

    // Update active powerups
    for (const [type, item] of this.activePowerUps) {
      if (item.duration > 0) {
        item.remainingTime -= dt;
        if (item.remainingTime <= 0) {
          this.activePowerUps.delete(type);
        }
      }
    }

    // Engine thruster cycle
    this.engineThrustAnim = (this.engineThrustAnim + dt * 15) % (Math.PI * 2);
  }

  public canShoot(now: number): boolean {
    const isRapid = this.activePowerUps.has('RAPID_FIRE');
    const fireInterval = isRapid ? this.baseFireRate * 0.45 : this.baseFireRate;
    return now - this.lastFireTime >= fireInterval;
  }

  public fire(now: number): Projectile[] {
    this.lastFireTime = now;
    const isMultiShot = this.activePowerUps.has('MULTI_SHOT');
    const isDamageBoost = this.activePowerUps.has('DAMAGE_BOOST');
    const damage = isDamageBoost ? this.baseDamage * 2 : this.baseDamage;
    const speed = GAME_CONFIG.PROJECTILES.PLAYER_SPEED;

    const centerX = this.x + this.width / 2;
    const gunY = this.y + 2;

    const projectiles: Projectile[] = [];

    if (isMultiShot) {
      // Triple spread fire
      projectiles.push({
        id: `p_${Math.random()}`,
        x: centerX,
        y: gunY,
        vx: 0,
        vy: -speed,
        radius: 4,
        damage,
        isPlayer: true,
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.8)',
      });
      projectiles.push({
        id: `p_${Math.random()}`,
        x: centerX - 12,
        y: gunY + 4,
        vx: -speed * 0.22,
        vy: -speed * 0.96,
        radius: 4,
        damage,
        isPlayer: true,
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.8)',
      });
      projectiles.push({
        id: `p_${Math.random()}`,
        x: centerX + 12,
        y: gunY + 4,
        vx: speed * 0.22,
        vy: -speed * 0.96,
        radius: 4,
        damage,
        isPlayer: true,
        color: '#c084fc',
        glowColor: 'rgba(192, 132, 252, 0.8)',
      });
    } else {
      // Twin synchronized laser cannons
      projectiles.push({
        id: `p_${Math.random()}`,
        x: centerX - 9,
        y: gunY,
        vx: 0,
        vy: -speed,
        radius: 3.5,
        damage,
        isPlayer: true,
        color: isDamageBoost ? '#f43f5e' : '#38bdf8',
        glowColor: isDamageBoost ? 'rgba(244, 63, 94, 0.8)' : 'rgba(56, 189, 248, 0.8)',
      });
      projectiles.push({
        id: `p_${Math.random()}`,
        x: centerX + 9,
        y: gunY,
        vx: 0,
        vy: -speed,
        radius: 3.5,
        damage,
        isPlayer: true,
        color: isDamageBoost ? '#f43f5e' : '#38bdf8',
        glowColor: isDamageBoost ? 'rgba(244, 63, 94, 0.8)' : 'rgba(56, 189, 248, 0.8)',
      });
    }

    return projectiles;
  }

  public takeDamage(amount: number): { damaged: boolean; shieldAbsorbed: boolean; fatal: boolean } {
    if (this.invulnerableTime > 0) {
      return { damaged: false, shieldAbsorbed: false, fatal: false };
    }

    let shieldAbsorbed = false;
    let remainingDamage = amount;

    // Shield absorbs damage first
    if (this.shield > 0) {
      shieldAbsorbed = true;
      if (this.shield >= remainingDamage) {
        this.shield -= remainingDamage;
        remainingDamage = 0;
      } else {
        remainingDamage -= this.shield;
        this.shield = 0;
      }
    }

    // Remaining damage applies to hull health
    if (remainingDamage > 0) {
      this.health = Math.max(0, this.health - remainingDamage);
    }

    // Brief invulnerability window
    this.invulnerableTime = GAME_CONFIG.PLAYER.INVULNERABLE_DURATION;

    return {
      damaged: true,
      shieldAbsorbed,
      fatal: this.health <= 0,
    };
  }

  public applyPowerUp(type: PowerUpType, duration: number) {
    if (type === 'HEALTH') {
      this.health = Math.min(this.maxHealth, this.health + 35);
      return;
    }
    if (type === 'SHIELD') {
      this.shield = Math.min(this.maxShield, this.shield + 50);
      return;
    }

    this.activePowerUps.set(type, {
      type,
      duration,
      remainingTime: duration,
    });
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // If invulnerable, flicker
    if (this.invulnerableTime > 0) {
      if (Math.floor(this.invulnerableTime * 12) % 2 === 0) {
        return; // skip frame for flicker effect
      }
    }

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();

    // 1. Engine Thruster Plasma Flames
    const flameHeight = 12 + Math.sin(this.engineThrustAnim) * 5;
    const flameGrad = ctx.createLinearGradient(cx, this.y + this.height - 4, cx, this.y + this.height + flameHeight);
    flameGrad.addColorStop(0, '#67e8f9');
    flameGrad.addColorStop(0.4, '#0284c7');
    flameGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 8, this.y + this.height - 4);
    ctx.lineTo(cx, this.y + this.height + flameHeight);
    ctx.lineTo(cx + 8, this.y + this.height - 4);
    ctx.closePath();
    ctx.fill();

    // 2. Spaceship Body (Vector Sci-Fi Fighter)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0284c7';

    // Main fuselage
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(cx, this.y); // nose tip
    ctx.lineTo(this.x + this.width, this.y + this.height - 8); // right wing tip
    ctx.lineTo(cx + 10, this.y + this.height - 4);
    ctx.lineTo(cx, this.y + this.height - 10); // engine bay
    ctx.lineTo(cx - 10, this.y + this.height - 4);
    ctx.lineTo(this.x, this.y + this.height - 8); // left wing tip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing accents & Cannons
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(cx - 10, this.y + 16);
    ctx.lineTo(this.x + 3, this.y + this.height - 10);
    ctx.lineTo(cx - 5, this.y + this.height - 6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 10, this.y + 16);
    ctx.lineTo(this.x + this.width - 3, this.y + this.height - 10);
    ctx.lineTo(cx + 5, this.y + this.height - 6);
    ctx.closePath();
    ctx.fill();

    // Cockpit canopy glow
    const cockpitGrad = ctx.createLinearGradient(cx, this.y + 8, cx, this.y + 26);
    cockpitGrad.addColorStop(0, '#e0f2fe');
    cockpitGrad.addColorStop(0.5, '#38bdf8');
    cockpitGrad.addColorStop(1, '#0369a1');

    ctx.fillStyle = cockpitGrad;
    ctx.beginPath();
    ctx.ellipse(cx, this.y + 18, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Shield Bubble Aura (if shield > 0)
    if (this.shield > 0) {
      const shieldRatio = this.shield / this.maxShield;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 + shieldRatio * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, this.width * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
