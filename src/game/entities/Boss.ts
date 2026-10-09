import { GAME_CONFIG } from '../config/gameConfig';
import { BossEntity, BossPhase, Projectile } from '../types/game';
import { clamp } from '../../lib/utils';

export class Boss implements BossEntity {
  public id: string;
  public name: string;
  public x: number;
  public y: number;
  public width: number = 180;
  public height: number = 110;
  public health: number;
  public maxHealth: number;
  public phase: BossPhase = 1;
  public phaseTitle: string = 'Phase 1: Orbital Siege';
  public vx: number = 90;
  public vy: number = 40;
  public attackTimer: number = 0;
  public specialAttackTimer: number = 0;
  public color: string = '#3b82f6';
  public shieldActive: boolean = false;
  public shieldHealth: number = 0;
  public maxShieldHealth: number = 200;

  private spiralAngle: number = 0;
  private corePulse: number = 0;

  constructor(name: string = 'VOID DESTROYER', maxHealth: number = 2400) {
    this.id = `boss_${Date.now()}`;
    this.name = name;
    this.width = 180;
    this.height = 110;
    this.x = (GAME_CONFIG.WORLD_WIDTH - this.width) / 2;
    this.y = -this.height - 20; // Starts off-screen, swoops in
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.shieldHealth = this.maxShieldHealth;
  }

  public update(dt: number, playerX: number, playerY: number): Projectile[] {
    this.corePulse += dt * 4;
    const projectiles: Projectile[] = [];

    // Boss Entrance or Movement Loop
    if (this.y < 60) {
      this.y += this.vy * dt;
      return projectiles; // no attacks while entering
    }

    // Determine current phase based on HP percentage
    const hpRatio = this.health / this.maxHealth;
    if (hpRatio > 0.70) {
      this.phase = 1;
      this.phaseTitle = 'Phase 1: Orbital Suppression';
      this.color = '#3b82f6'; // Neon Blue
      this.shieldActive = false;
    } else if (hpRatio > 0.40) {
      this.phase = 2;
      this.phaseTitle = 'Phase 2: Radial Barrage';
      this.color = '#8b5cf6'; // Purple
      this.shieldActive = false;
    } else if (hpRatio > 0.15) {
      this.phase = 3;
      this.phaseTitle = 'Phase 3: Hyper-Drive Overcharge';
      this.color = '#f97316'; // Orange
      this.shieldActive = false;
    } else {
      this.phase = 4;
      this.phaseTitle = 'FINAL PHASE: CRITICAL CORE MELTDOWN';
      this.color = '#ef4444'; // Red
      this.shieldActive = true;
    }

    // Movement speeds scale with phase
    const speedMultiplier = this.phase === 4 ? 1.7 : this.phase === 3 ? 1.4 : 1.0;
    this.x += this.vx * speedMultiplier * dt;

    if (this.x <= 40) {
      this.x = 40;
      this.vx = Math.abs(this.vx);
    } else if (this.x >= GAME_CONFIG.WORLD_WIDTH - this.width - 40) {
      this.x = GAME_CONFIG.WORLD_WIDTH - this.width - 40;
      this.vx = -Math.abs(this.vx);
    }

    // Gentle vertical bobbing
    this.y = 60 + Math.sin(this.corePulse * 0.5) * 20;

    // Attack Timers
    this.attackTimer += dt;
    this.specialAttackTimer += dt;

    const baseInterval = this.phase === 4 ? 0.35 : this.phase === 3 ? 0.6 : this.phase === 2 ? 0.9 : 1.2;

    // Standard phase attacks
    if (this.attackTimer >= baseInterval) {
      this.attackTimer = 0;
      projectiles.push(...this.executePrimaryAttack(playerX, playerY));
    }

    // Special attacks (radial or spiral bullet hell)
    const specialInterval = this.phase >= 3 ? 2.5 : 4.0;
    if (this.specialAttackTimer >= specialInterval) {
      this.specialAttackTimer = 0;
      projectiles.push(...this.executeSpecialAttack());
    }

    return projectiles;
  }

  private executePrimaryAttack(playerX: number, playerY: number): Projectile[] {
    const projectiles: Projectile[] = [];
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height - 10;
    const speed = GAME_CONFIG.PROJECTILES.BOSS_SPEED;

    if (this.phase === 1) {
      // Twin alternating heavy lasers
      projectiles.push({
        id: `bp_${Math.random()}`,
        x: cx - 45,
        y: cy,
        vx: 0,
        vy: speed,
        radius: 6,
        damage: 20,
        isPlayer: false,
        color: '#60a5fa',
        glowColor: 'rgba(96, 165, 250, 0.9)',
      });
      projectiles.push({
        id: `bp_${Math.random()}`,
        x: cx + 45,
        y: cy,
        vx: 0,
        vy: speed,
        radius: 6,
        damage: 20,
        isPlayer: false,
        color: '#60a5fa',
        glowColor: 'rgba(96, 165, 250, 0.9)',
      });
    } else if (this.phase === 2) {
      // 5-way spread cannon
      const angles = [-0.5, -0.25, 0, 0.25, 0.5];
      angles.forEach((ang) => {
        projectiles.push({
          id: `bp_${Math.random()}`,
          x: cx,
          y: cy,
          vx: Math.sin(ang) * speed * 1.1,
          vy: Math.cos(ang) * speed * 1.1,
          radius: 5,
          damage: 18,
          isPlayer: false,
          color: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.9)',
        });
      });
    } else if (this.phase === 3) {
      // Direct high-speed pulse targeted at player
      const dx = (playerX + 21) - cx;
      const dy = (playerY + 24) - cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      for (let offset of [-25, 0, 25]) {
        projectiles.push({
          id: `bp_${Math.random()}`,
          x: cx + offset,
          y: cy,
          vx: (dx / len) * speed * 1.35,
          vy: (dy / len) * speed * 1.35,
          radius: 5.5,
          damage: 22,
          isPlayer: false,
          color: '#fb923c',
          glowColor: 'rgba(251, 146, 60, 0.9)',
        });
      }
    } else {
      // Phase 4: Bullet hell spiral stream
      this.spiralAngle += 0.45;
      for (let i = 0; i < 3; i++) {
        const ang = this.spiralAngle + (i * Math.PI * 2) / 3;
        projectiles.push({
          id: `bp_${Math.random()}`,
          x: cx,
          y: cy,
          vx: Math.cos(ang) * speed * 1.25,
          vy: Math.sin(ang) * speed * 1.25,
          radius: 5,
          damage: 24,
          isPlayer: false,
          color: '#f87171',
          glowColor: 'rgba(248, 113, 113, 0.9)',
        });
      }
    }

    return projectiles;
  }

  private executeSpecialAttack(): Projectile[] {
    const projectiles: Projectile[] = [];
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const count = this.phase >= 3 ? 16 : 10;
    const speed = GAME_CONFIG.PROJECTILES.BOSS_SPEED * 0.9;

    // Full 360 degree radial nova
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      projectiles.push({
        id: `bp_nova_${Math.random()}`,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5,
        damage: 20,
        isPlayer: false,
        color: this.color,
        glowColor: this.color,
      });
    }

    return projectiles;
  }

  public takeDamage(amount: number): boolean {
    if (this.shieldActive && this.shieldHealth > 0) {
      this.shieldHealth -= amount;
      if (this.shieldHealth <= 0) {
        this.shieldActive = false;
      }
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    return this.health <= 0;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    // 1. Massive Mothership Wings & Plating
    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    // Top center bridge
    ctx.moveTo(cx - 30, this.y);
    ctx.lineTo(cx + 30, this.y);
    // Outer right wing
    ctx.lineTo(this.x + this.width, this.y + 35);
    ctx.lineTo(this.x + this.width - 20, this.y + this.height - 15);
    ctx.lineTo(cx + 50, this.y + this.height);
    ctx.lineTo(cx, this.y + this.height + 12); // main heavy cannon tip
    ctx.lineTo(cx - 50, this.y + this.height);
    // Outer left wing
    ctx.lineTo(this.x + 20, this.y + this.height - 15);
    ctx.lineTo(this.x, this.y + 35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Heavy Wing Armaments
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(this.x + 20, this.y + 40, 25, 45);
    ctx.fillRect(this.x + this.width - 45, this.y + 40, 25, 45);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.x + 20, this.y + 40, 25, 45);
    ctx.strokeRect(this.x + this.width - 45, this.y + 40, 25, 45);

    // 3. Pulsing Core Reactor
    const pulseSize = 14 + Math.sin(this.corePulse) * 4;
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, pulseSize);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, this.color);
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
    ctx.fill();

    // Core ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Overdrive Shield Bubble (Phase 4)
    if (this.shieldActive && this.shieldHealth > 0) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, this.width * 0.65, this.height * 0.75, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}
